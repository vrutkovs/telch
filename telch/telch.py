# -*- coding: utf-8 -*-
from aiohttp import web, WSCloseCode, WSMsgType
from aiohttp_jinja2 import setup, template, render_template
from jinja2 import FileSystemLoader
import taskwarrior
import json

INITIAL_FILTER = {
    'status': 'pending',
    'sortby': 'urgency',
    'sorted_reverse': True
}

async def on_shutdown(app):
    for ws in app['websockets']:
        await ws.close(code=WSCloseCode.GOING_AWAY,
                       message='Server shutdown')


@template('home.jinja2')
async def root(request):
    return {'ws_url': request.app.router['ws'].url_for()}


async def ws(request):
    ws = web.WebSocketResponse()
    request.app['websockets'].append(ws)
    await ws.prepare(request)
    async for msg in ws:
        if msg.tp == WSMsgType.text:
            if msg.data == 'ready':
                item_filter = INITIAL_FILTER
            else:
                item_filter = json.loads(msg.data)

            response = render_template('filter.jinja2', request, {'filters': item_filter})
            ws.send_str(json.dumps({'filter': response.text}))

            for item in taskwarrior.get_tasks_matching(app.w, item_filter):
                response = render_template('task.jinja2', request, {'task': item})
                ws.send_str(json.dumps({'task': response.text}))

            ws.send_str(json.dumps({'end': True}))
    return ws


app = web.Application(debug=True)
setup(app, loader=FileSystemLoader('templates'))
app.router.add_static('/static/', path='static', show_index=True)
app.router.add_route('*', '/', root)
app.router.add_route('*', '/ws', ws, name='ws')

app['websockets'] = []
app.on_shutdown.append(on_shutdown)

app.w = taskwarrior.get_taskwarrior_instance()

web.run_app(app)
