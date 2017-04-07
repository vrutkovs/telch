# -*- coding: utf-8 -*-
from aiohttp import web, WSCloseCode, WSMsgType
from aiohttp_jinja2 import setup, template, render_template
from jinja2 import FileSystemLoader
import taskwarrior
import json

INITIAL_FILTER = {
    'status': 'pending',
    'sortby': 'urgency',
    'order': 'desc'
}

LABEL_MAPPING = {
    
}

async def on_shutdown(app):
    for ws in app['websockets']:
        await ws.close(code=WSCloseCode.GOING_AWAY,
                       message='Server shutdown')


@template('home.jinja2')
async def root(request):
    return {
        'ws_url': request.app.router['ws'].url_for()}


async def ws(request):
    ws = web.WebSocketResponse()
    request.app['websockets'].append(ws)
    await ws.prepare(request)
    async for msg in ws:
        if msg.tp == WSMsgType.text:
            if msg.data != 'ready':
                print("Got data: '%s'" % msg.data)
                request.app['active_filter'] = json.loads(msg.data)

            response = render_template('filter.jinja2', request,
                                       {'filters': request.app['active_filter']})
            ws.send_str(json.dumps({'filter_html': response.text}))
            ws.send_str(json.dumps({'filter_json': request.app['active_filter']}))

            tasks = taskwarrior.get_tasks_matching(app.w, request.app['active_filter'])
            for task in tasks:
                response = render_template('task.jinja2', request, {'task': task})
                ws.send_str(json.dumps({'task': response.text}))

            ws.send_str(json.dumps({'end': True}))
    return ws


app = web.Application(debug=True)
setup(app, loader=FileSystemLoader('templates'))
app.router.add_static('/static/', path='static', show_index=True)
app.router.add_route('*', '/', root)
app.router.add_route('*', '/ws', ws, name='ws')

app['websockets'] = []
app['active_filter'] = INITIAL_FILTER
app.on_shutdown.append(on_shutdown)

app.w = taskwarrior.get_taskwarrior_instance()

web.run_app(app)
