from aiohttp import web

async def root(request):
    return web.Response(text="Hello")


def add_routes(router):
    router.add_route('*', '/', root)
