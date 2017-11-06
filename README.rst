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
.. image:: https://user-images.githubusercontent.com/114501/29717902-39a61546-89b1-11e7-89a5-892cb3a4e81b.png
* Sort by priority, project, due date etc.
.. image:: https://user-images.githubusercontent.com/114501/29717895-33bb0bb4-89b1-11e7-9168-6536bf01f660.png

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

