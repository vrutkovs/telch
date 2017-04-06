# -*- coding: utf-8 -*-
from aiohttp import web, WSCloseCode
from taskw import TaskWarrior
import aiohttp_jinja2
import jinja2

from routes import add_routes

async def on_shutdown(app):
    for ws in app['websockets']:
        await ws.close(code=WSCloseCode.GOING_AWAY,
                       message='Server shutdown')


app = web.Application(debug=True)
aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader('templates'))
app.router.add_static('/static/', path='static', show_index=True)
add_routes(app.router)

app['websockets'] = []
app.on_shutdown.append(on_shutdown)

app.w = TaskWarrior(marshal=True)

web.run_app(app)
