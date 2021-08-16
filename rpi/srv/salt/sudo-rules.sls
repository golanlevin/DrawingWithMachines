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
        - source: salt://sudo-rules/etc/sudoers.d/099_insults
      {%- if salt['file.file_exists' ]('/etc/sudoers.d/010_pi-nopasswd') %}
      - /etc/sudoers.d/011_pi-nopasswd-override:
        - source: salt://sudo-rules/etc/sudoers.d/011_pi-nopasswd-override
      {%- endif %}
