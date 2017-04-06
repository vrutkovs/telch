FROM fedora:25

RUN dnf update -y && \
    dnf install -y python3-pip git npm task && \
    dnf clean all && \
    npm install -g bower

ADD . /telch

RUN cd /telch && \
    pip3 install -r requirements.txt && \
    bower install --allow-root && \
    git log -1 --pretty=format:'%h' --abbrev-commit > telch/templates/commit.jinja2

# Prepare taskwarrior part
RUN touch ~/.taskrc && mkdir ~/.task

WORKDIR /telch/telch

EXPOSE 8080

CMD ["python3", "telch.py"]
