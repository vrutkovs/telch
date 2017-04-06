#!/usr/bin/env python
# -*- coding: utf-8 -*-

from setuptools import setup
from pip.req import parse_requirements
from pip.download import PipSession

with open('README.rst') as readme_file:
    readme = readme_file.read()

pip_session = PipSession()
parsed_reqs = parse_requirements('requirements.txt', session=pip_session)
parsed_reqs_dev = parse_requirements('requirements_dev.txt', session=pip_session)
requirements = [str(x.req) for x in parsed_reqs]
test_requirements = [str(x.req) for x in parsed_reqs_dev]

setup(
    name='telch',
    version='0.1.0',
    description="Telch is a web interface for taskd - a Taskwarrior's sync server",
    long_description=readme,
    author="Vadim Rutkovsky",
    author_email='vrutkovs@redhat.com',
    url='https://github.com/vrutkovs/telch',
    packages=[
        'telch',
    ],
    package_dir={'telch':
                 'telch'},
    include_package_data=True,
    install_requires=requirements,
    license="GNU General Public License v3",
    zip_safe=False,
    keywords='telch',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: GNU General Public License v3 (GPLv3)',
        'Natural Language :: English',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ],
    test_suite='tests',
    tests_require=test_requirements
)
