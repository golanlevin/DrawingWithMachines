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

{% for axidraw_user in pillar['axidraws'] %}
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
    - name: urllib3
    - reload_modules: True

pip_requests:
  pip.installed:
    - name: requests
    - reload_modules: True

pip_docker:
  pip.installed:
   - require:
      - pip
      - pip_urllib3
      - pip_requests
   - name: docker==4.4.4
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
    - group_add:
      - 2000
    - port_bindings:
      - 80:80/tcp
    - read_only: False
    - restart_policy: always
