from aiohttp_jinja2 import template


@template('home.jinja2')
async def root(request):
    tasks = request.app.w.load_tasks(command='pending')
    return {'tasks': tasks['pending']}


def add_routes(router):
    router.add_route('*', '/', root)
