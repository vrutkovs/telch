FROM fedora:25

RUN dnf update -y && \
    dnf install -y python3-pip git npm && \
    dnf clean all && \
    npm install -g bower

ADD . /telch

RUN cd /telch && \
    pip3 install -r requirements.txt && \
    bower install --allow-root && \
    git log -1 --pretty=format:'%h' --abbrev-commit > telch/templates/commit.jinja2

WORKDIR /telch/telch

EXPOSE 8080

CMD ["python3", "telch.py"]
