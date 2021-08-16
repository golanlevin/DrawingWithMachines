nfs_server:
  pkg.installed:
    - pkgs:
      - nfs-kernel-server
      - acl
      - nfs4-acl-tools

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
    - refresh_db: true
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

#docker_compose:
#  file.managed:
#    - require:
#       - docker
#    - name: /usr/local/bin/docker-compose
#    - source: "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)"
#    - user: root
#    - group: root
#    - mode: '0755'
#    - source_hash: https://github.com/docker/compose/releases/download/1.29.2/docker-compose-Linux-x86_64.sha256
