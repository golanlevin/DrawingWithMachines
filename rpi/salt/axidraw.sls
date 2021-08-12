us_locale:
  locale.present:
    - name: en_US.UTF-8

system:
  pkg.installed:
    - pkgs:
      - htop
      - curl
      - wget
      - usbutils
  locale.system:
    - name: en_US.UTF-8
    - require:
      - locale: us_locale
  timezone.system:
    - name: America/New_York

axidraw_group:
  group.present:
    - gid: 2000
    - name: axidraw

{% for axidraw_user in grains['axidraws'] %}
{{ axidraw_user.name }}:
  user.present:
    - uid: {{ 2000 + axidraw_user.id }}
#    - gid: {{ 2000 + axidraw_user.id }}
    - usergroup: True
    - createhome: True
    - empty_password: True
    - allow_uid_change: True
    - allow_gid_change: True
    - remove_groups: True
    - require:
      - axidraw_group
    - groups:
        - axidraw
#        - dialout
        - users
{% endfor %}

udev:
  file.managed:
    - require:
        - axidraw_group
    - template: jinja
    - name: /etc/udev/rules.d/99-axidraw.rules
    - source: salt://axidraw/etc/udev/rules.d/99-axidraw.rules
    - user: root
    - group: root
    - mode: '0644'
    - makedirs: True
  cmd.run:
    - name: /usr/bin/udevadm control --reload-rules
    - onchanges:
      - file: /etc/udev/rules.d/99-axidraw.rules

sudo:
  pkg.installed:
    - pkgs:
      - sudo

sudo_config:
  file.managed:
    - require:
        - sudo
    - user: root
    - group: root
    - mode: '0440'
    - makedirs: True
    - names:
      - /etc/sudoers.d/099_insults:
        - source: salt://axidraw/etc/sudoers.d/099_insults
      {%- if salt['file.file_exists' ]('/etc/sudoers.d/010_pi-nopasswd') %}
      - /etc/sudoers.d/011_pi-nopasswd-override:
        - source: salt://axidraw/etc/sudoers.d/011_pi-nopasswd-override
      {%- endif %}

#ssh:
#  pkg.installed:
#    - pkgs:
#      - openssh-server

#ssh_config:
#  file.managed:
#    - require:
#        - ssh
#    - user: root
#    - group: root
#    - mode: '0644'
#    - makedirs: True

touchscreen_xss:
  pkg.installed:
    - pkgs:
      - libxss1
  file.managed:  
    - user: root  
    - group: root   
    - mode: '0755'
    - makedirs: False
    - names:
      - /usr/local/bin/xssstart:
        {% if grains['cpuarch'] == 'armv7l' %}
        - source: salt://axidraw/usr/local/bin/xssstart-armv7l
        {% endif %}
      - /usr/local/bin/clicklock:
        {% if grains['cpuarch'] == 'armv7l' %}
        - source: salt://axidraw/usr/local/bin/clicklock-armv7l
        {% endif %}

login:
  pkg.installed:
    - pkgs:
      - lightdm
      - slick-greeter
      - onboard
  cmd.run:
    - name: systemctl set-default graphical.target
    - unless: test `systemctl get-default` = 'graphical.target'
  file.managed:
    - user: root
    - group: root
    - mode: '0644'
    - makedirs: True
    - require:
        - touchscreen_xss
    - names:
      - /etc/X11/default-display-manager:
        - source: salt://axidraw/etc/X11/default-display-manager
      - /etc/lightdm/lightdm.conf.d/99_axidraw.conf:
        - source: salt://axidraw/etc/lightdm/lightdm.conf.d/99_axidraw.conf
      - /etc/lightdm/slick-greeter.conf:
        - source: salt://axidraw/etc/lightdm/slick-greeter.conf
      - /etc/X11/xorg.conf.d/99_axidraw.conf:
        - source: salt://axidraw/etc/X11/xorg.conf.d/99_axidraw.conf

desktop:
  pkg.installed: 
    - pkgs:    
      - xfwm4
      - xfce4-panel
      - xfdesktop4
      - xfce4-session
      - xfce4-terminal
      - xfce4-appfinder
      - thunar
      - onboard
  file.managed:
    - user: root
    - group: root
    - mode: '0644'
    - makedirs: True
    - names:
      - /etc/xdg/xfce4/kiosk/kioskrc:
        - source: salt://axidraw/etc/xdg/xfce4/kiosk/kioskrc
      - /etc/xdg/xfce4/xfconf/xfce-perchannel-xml/xfce4-desktop.xml:
        - source: salt://axidraw/etc/xdg/xfce4/xfconf/xfce-perchannel-xml/xfce4-desktop.xml
      - /etc/xdg/xfce4/xfconf/xfce-perchannel-xml/xfce4-panel.xml:
        - source: salt://axidraw/etc/xdg/xfce4/xfconf/xfce-perchannel-xml/xfce4-panel.xml
      - /etc/xdg/xfce4/xfconf/xfce-perchannel-xml/xfwm4.xml:
        - source: salt://axidraw/etc/xdg/xfce4/xfconf/xfce-perchannel-xml/xfwm4.xml

flatpak:
  pkg.installed: 
    - pkgs:    
      - flatpak

flatpak_repo:
  cmd.run:
    - require:
       - flatpak
    - name: flatpak remote-add --system --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
    - unless: test `flatpak remotes --system | grep 'flathub'` = 'flathub'
    - onchanges:
       - flatpak

flatpak_app_inkscape:
  cmd.run:
    - require:
        - flatpak
        - flatpak_repo
    - name: flatpak install --system --noninteractive flathub org.inkscape.Inkscape
    - unless: "test \"`flatpak info --system org.inkscape.Inkscape | grep Version`\" = '     Version: 1.0.1'"

flatpak_app_inkscape_permission:
  cmd.run:
    - require:
        - flatpak
        - flatpak_repo
        - flatpak_app_inkscape
    - name: flatpak override org.inkscape.Inkscape --device=all --system
    - unless: test `flatpak override --show --system org.inkscape.Inkscape | grep devices` = 'devices=all;'

{% if not salt['file.directory_exists' ]('/var/lib/flatpak/app/org.inkscape.Inkscape/current/active/files/share/inkscape/extensions/ad-ink_274_r1') %}
flatpak_app_inkscape_ext_axidraw:
  archive.extracted:
    - name: /var/lib/flatpak/app/org.inkscape.Inkscape/current/active/files/share/inkscape/extensions
    - source: salt://axidraw_inkscape_ext/ad-ink_274_r1.zip
#    - options: "--strip-components=1"
    - overwrite: True
    - enforce_toplevel: False
    - user: root
    - group: root
    - require:
       - flatpak_app_inkscape
{% endif %}

pip:
  pkg.installed:
    - pkgs:
      - python3-pip  

pip_axidraw_requirements:
  pkg.installed:
    - pkgs:
        - libxslt1.1

python3_virtualenv:
  pkg.installed:
    - pkgs:
        - python3-venv

pip_axidraw_venv:
  cmd.run:
    - name: python3 -m venv /opt/venv-axidraw
    - unless: test -d /opt/venv-axidraw
    - require:
      - python3_virtualenv

pip_axidraw:
  pip.installed:
   - require:
      - pip
      - pip_axidraw_requirements
      - pip_axidraw_venv
   - bin_env: /opt/venv-axidraw
   - name: https://cdn.evilmadscientist.com/dl/ad/public/AxiDraw_API.zip
   - upgrade: True
   - unless: test `/opt/venv-axidraw/bin/pip3 freeze | grep axidrawinternal` = 'axidrawinternal==2.7.4'

pip_axidraw_profile_alias:
  file.managed:
    - require:
        - pip_axidraw
    - user: root
    - group: root
    - mode: '0644'
    - makedirs: True
    - names:
      - /etc/profile.d/99-axidraw-aliases.sh:
        - source: salt://axidraw/etc/profile.d/99-axidraw-aliases.sh

pip_axidraw_bash_alias:
  file.append:
    - require:
        - pip_axidraw
    - name: /etc/bash.bashrc
    - text:
      - ""
      - "# 99-axidraw-aliases"
      - ". /etc/profile.d/99-axidraw-aliases.sh"
