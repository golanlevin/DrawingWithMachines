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
  keyboard.system:
    name: us
