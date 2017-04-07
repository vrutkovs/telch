from taskw import TaskWarrior


def get_taskwarrior_instance():
    return TaskWarrior(marshal=True)


def get_tasks_matching(w, filter_dict):
    tasks = w.load_tasks(command='all')

    if 'status' in filter_dict:
        tasks = tasks[filter_dict['status'].lower()]
    else:
        tasks = tasks['pending'] + tasks['completed']

    if 'sortby' in filter_dict:
        order = filter_dict.get('order', 'asc')
        key = filter_dict['sortby']
        tasks = sorted(tasks,
                       key=lambda x: x.get(key, ''),
                       reverse=order == 'desc')

    return tasks
