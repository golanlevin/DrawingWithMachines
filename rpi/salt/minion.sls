salt-minion:
  file.managed:
    - user: root
    - group: root
    - mode: '0440'
    - makedirs: True
    - name: /etc/salt/minion.d/99-axidraw.conf
    - contents: |
        master: sfci-pi1.cfa.cmu.edu
