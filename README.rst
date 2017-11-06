===============================
Telch
===============================


.. image:: https://img.shields.io/travis/vrutkovs/telch.svg
        :target: https://travis-ci.org/vrutkovs/telch
.. image:: https://pyup.io/repos/github/vrutkovs/telch/shield.svg
     :target: https://pyup.io/repos/github/vrutkovs/telch/
     :alt: Updates


Telch is a web interface for Taskwarrior


* Free software: GNU General Public License v3
* Documentation: coming soon?

HOWTO
--------
```
sudo docker run --rm --name=telch -ti -v ~/.taskrc:/root/.taskrc -v ~/.task:/root/.task -p 80:8080 vrutkovs/telch
```

Features
--------

* Display Taskwarrior tasks
* Sort by priority, project, due date etc.

TODO
--------

* Documentation
* Tests
* CRUD

Credits
---------

This package was created with Cookiecutter_ and the `audreyr/cookiecutter-pypackage`_ project template.

.. _Cookiecutter: https://github.com/audreyr/cookiecutter
.. _`audreyr/cookiecutter-pypackage`: https://github.com/audreyr/cookiecutter-pypackage

