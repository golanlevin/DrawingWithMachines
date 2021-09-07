nfs_server:
  pkg.installed:
    - pkgs:
      - nfs-kernel-server
      - acl
      - nfs4-acl-tools
  service.running:
    - name: nfs-server
    - enable: true
    - require: 
      - pkg: nfs_server
    - watch: 
      - pkg: nfs_server

axidraw_group:
  group.present:
    - gid: 2000
    - name: axidraw

{% for axidraw_user in pillar['axidraws_old'] %}
{{ axidraw_user }}:
  user.absent:
    - purge: True
    - force: False
{% endfor %}{% for axidraw_user in pillar['axidraws'] %}
{{ axidraw_user.name }}:
  user.present:
    - uid: {{ 2000 + axidraw_user.id }}
    - gid: 2000
    - usergroup: False
    - createhome: False
    - empty_password: True
    - allow_uid_change: True
    - allow_gid_change: True
    - remove_groups: True
    - shell: /bin/nologin
    - require:
      - axidraw_group
    - groups:
        - axidraw
        - users
{% endfor %}

axidraw_dir:
  file.directory:
    - require:
        - axidraw_group
    - name: '/srv/axidraw'
    - user: root
    - group: axidraw
    - dir_mode: 770
    - file_mode: 660
    - makedirs: True
    - recurse:
      - user
      - group
      - mode

axidraw_dir_acl_default:
  module.run:
  - name: acl.modfacl
  - acl_type: 'default:group'
  - acl_name: axidraw
  - perms: rwX
  - args:
    - /srv/axidraw
    - recursive: True
  - require:
    - axidraw_dir
    - axidraw_group

axidraw_dir_acl:
  module.run:
  - name: acl.modfacl
  - acl_type: 'group'
  - acl_name: axidraw
  - perms: rwX
  - args:
    - /srv/axidraw
    - recursive: True
  - require:
    - axidraw_dir
    - axidraw_group

nfs_export_axidraw:
  nfs_export.present:
    - require:
      - nfs_server
      - axidraw_dir
    - name: '/srv/axidraw'
    - clients:
{%- set axidraw_hosts = [] -%}
{%- for axidraw_user in pillar['axidraws'] -%}
{%- set axidraw_hosts = axidraw_hosts.append(axidraw_user.minion) -%}
{%- endfor -%}
{% for this_host in axidraw_hosts | unique %}
      - hosts: '{{ this_host }}'
        options:
          - 'rw'
          - 'subtree_check'
{% endfor %}

apt_https_gpg_transport:
  pkg.installed:
    - pkgs:
       - apt-transport-https
       - ca-certificates
       - gnupg
       - curl

docker_repo_key:
  cmd.run:
    - require:
      - apt_https_gpg_transport
    - name: curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --batch --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    - unless: test -f /usr/share/keyrings/docker-archive-keyring.gpg

docker_repo:
  pkgrepo.managed:
    - humanname: docker
    - name: deb [arch=armhf signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian buster stable
    - file: /etc/apt/sources.list.d/docker.list
    - refresh_db: True
    - clean_file: True
    - require:
      - docker_repo_key
      - apt_https_gpg_transport
    - require_in:
      - docker

docker:
  pkg.installed:
    - require:
      - docker_repo
    - pkgs:
       - docker-ce
       - docker-ce-cli
       - containerd.io
  service.running:
    - name: docker
    - enable: true
    - require: 
      - pkg: docker
    - watch: 
      - pkg: docker

pip:
  pkg.installed:
    - pkgs:
        - python3-pip

pip_urllib3:
  pip.installed:
    - name: urllib3==1.26.6
    - reload_modules: True

pip_requests:
  pip.installed:
    - name: requests==2.26.0
    - reload_modules: True

pip_docker:
  pip.installed:
   - name: docker==4.4.4
  # pkg.installed:
  #  - pkgs:
  #     - python3-docker
   - require:
      - pip
      - pip_urllib3
      - pip_requests
   - reload_modules: True
   - upgrade: True

filebrowser_docker_config:
  file.managed:
    - user: root
    - group: root
    - mode: '0644'
    - makedirs: True
    - names:
      - /srv/axidraw-docker/filebrowser/filebrowser.json:
        - source: salt://axidraw-master/srv/axidraw-docker/filebrowser/filebrowser.json

filebrowser_docker_db:
  file.managed:
    - user: root
    - group: root
    - mode: '0644'
    - makedirs: True
    - replace: False
    - names:
      - /srv/axidraw-docker/filebrowser/filebrowser.db:
        - source: salt://axidraw-master/srv/axidraw-docker/filebrowser/filebrowser.db

filebrowser_docker_compose:
  docker_container.running:
    - require:
      - filebrowser_docker_config
      - filebrowser_docker_db
      - docker
      - pip_docker
      - axidraw_group
    - name: filebrowser
    - image: filebrowser/filebrowser:v2.16.1
    - watch_action: force
    - watch:
      - file: /srv/axidraw-docker/filebrowser/filebrowser.json
    - start: True
    - binds:
      - /srv/axidraw:/srv:rw
      - /srv/axidraw-docker/filebrowser/filebrowser.db:/database.db:rw
      - /srv/axidraw-docker/filebrowser/filebrowser.json:/.filebrowser.json:ro
    - environment:
      - TZ: {{ salt['timezone.get_zone']() }}
    - user: 0:2000
    - port_bindings:
      - 127.0.0.1:8081:80/tcp
    - read_only: False
    - restart_policy: always
#    - /bin/sh -c \"/filebrowser & (sleep 2 && /filebrowser config set --auth.method=proxy --auth.header=X-Remote-User)\"

#guac_docker_network:
#  docker_network.present:
#    - name: net_guac
#    - internal: True
#    - check_duplicate: True
#
# guacd_docker:
#   docker_container.running:
#     - require:
#       - docker
#       - pip_docker
#       - guac_docker_network
#     - name: guacd
#     - image: linuxserver/guacd:1.3.0-ls101    # Can't use official because need Pi support
#     - networks:
#       - net_guac:
#         - aliases:
#           - guacd
#     - start: True
#     - environment:
#       - TZ: {{ salt['timezone.get_zone']() }}
#     - read_only: False
#     - restart_policy: always

guacamole_docker:
  docker_container.running:
    - require:
      - docker
      - pip_docker
    - name: guacamole
    - image: oznu/guacamole:1.3.0-{{ grains['osarch'] }}    # Can't use official because need Pi support
    - start: True
    - binds:
      - /srv/axidraw-docker/guacamole/config:/config:rw
    - environment:
      - TZ: {{ salt['timezone.get_zone']() }}
      - EXTENSIONS: auth-header
    - port_bindings:
      - 127.0.0.1:8080:8080/tcp
    - read_only: False
    - restart_policy: always

nginx_repo:
  pkgrepo.managed:
    - humanname: nginx
    - name: deb https://nginx.org/packages/mainline/debian/ buster nginx
    - file: /etc/apt/sources.list.d/nginx.list
    - refresh_db: True
    - clean_file: True
    - require:
      - apt_https_gpg_transport
    - require_in:
      - nginx
    - gpgcheck: 1
    - key_url: https://nginx.org/keys/nginx_signing.key

nginx_auth:
  file.managed:
    - name: /etc/nginx/auth/axidrawpasswd
    - user: root
    - group: www-data
    - mode: '0640'
    - makedirs: True
    - replace: False
    - contents: ''

static_assets:
  file.managed:
    - user: root
    - group: root
    - mode: '0644'
    - makedirs: True
    - names:
      - /srv/axidraw-www/index.html:
        - source: salt://axidraw-master/srv/axidraw-www/index.html
      - /srv/axidraw-www/assets/css/bootstrap.min.css:
        - source: https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css
        - source_hash: sha384=2b2657100837421a8b3291bcafef1f8405cb464dafbe80b67f7074f735579fc080e502157d9389dc10acc363f4a7f59e
      - /srv/axidraw-www/assets/js/bootstrap.bundle.min.js:
        - source: https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js
        - source_hash: sha384=5350c0580ce70477aa108955482833abe73d82a180267e5cfedf7d27278a6bdc71698a52bc75396b0b2e655545221be3

nginx:
  pkg.installed:
    - require:
      - nginx_repo
      - nginx_auth
      - nginx_letsencrypt_folders
      - static_assets
    - pkgs:
      - nginx
      - apache2-utils
  file.managed:
    - names:
      - /etc/nginx/conf.d/99-axidraw.conf:
        - source: salt://axidraw-master/etc/nginx/conf.d/99-axidraw.conf
      - /etc/nginx/include/axidraw_strong_headers.conf:
        - source: salt://axidraw-master/etc/nginx/include/axidraw_strong_headers.conf
      - /etc/nginx/include/axidraw_strong_headers_proxy_hide.conf:
        - source: salt://axidraw-master/etc/nginx/include/axidraw_strong_headers_proxy_hide.conf
      - /etc/nginx/include/axidraw_ssl_hsts.conf:
        - source: salt://axidraw-master/etc/nginx/include/axidraw_ssl_hsts.conf
      - /etc/nginx/include/axidraw_ssl_intermediate.conf:
        - source: salt://axidraw-master/etc/nginx/include/axidraw_ssl_intermediate.conf
    - user: root
    - group: root
    - mode: '0644'
    - makedirs: True

nginx_running:
  service.running:
    - require:
      - nginx
      - nginx_letsencrypt_folders
      - nginx_dhparam
    - name: nginx
    - enable: True
    - reload: True
    - require: 
      - pkg: nginx
    - watch: 
      - pkg: nginx
      - module: nginx_config_test
      - acme: nginx_letsencrypt

nginx_reload:
  cmd.run:
    - name: systemctl reload nginx

nginx_config_test:
  module.wait:
    - name: nginx.configtest
    - require:
        - nginx_dhparam
        - file: nginx
        - nginx_auth
    - watch:
      - file: /etc/nginx/conf.d/99-axidraw.conf
      - file: /etc/nginx/include/axidraw_strong_headers.conf
      - file: /etc/nginx/include/axidraw_strong_headers_proxy_hide.conf
      - file: /etc/nginx/include/axidraw_ssl_hsts.conf
      - file: /etc/nginx/include/axidraw_ssl_intermediate.conf
      - file: /etc/nginx/auth/axidrawpasswd
      - cmd: nginx_dhparam

nginx_letsencrypt_folders:
  file.directory:
    - names:
      - '/srv/axidraw-letsencrypt/.well-known/acme-challenge'
    - user: root
    - group: www-data
    - dir_mode: 750
    - file_mode: 640
    - makedirs: True
    - recurse:
      - user
      - group
      - mode

certbot:
  pkg.installed:
    - pkgs:
      - certbot
      - openssl

nginx_dhparam:
  cmd.run:
    - name:  openssl dhparam -out /srv/axidraw_dhparam 4096
    - unless: test -f /srv/axidraw_dhparam

nginx_letsencrypt:
  acme.cert:
    - name: sfci-pi1.cfa.cmu.edu
    - email: pnaseck@andrew.cmu.edu
    - webroot: /srv/axidraw-letsencrypt
    - renew: 14
    - keysize: 4096
    - owner: root
    - group: www-data
    - mode: '0640'
    - test_cert: False
    - onchanges_in:
      - nginx_reload
    - require:
      - certbot
      - nginx_letsencrypt_folders
