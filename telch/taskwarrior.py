from taskw import TaskWarrior


def get_taskwarrior_instance():
    return TaskWarrior(marshal=True)


def get_tasks_matching(w, filter_dict):
    tasks = w.load_tasks(command='all')

    if 'status' in filter_dict:
        tasks = tasks[filter_dict['status']]
    else:
        tasks = tasks['pending'] + tasks['completed']

    if 'sortby' in filter_dict:
        order = filter_dict.get('order', 'asc')
        tasks = sorted(tasks,
                       key=lambda x: x[filter_dict['sortby']],
                       reverse=order == 'desc')

    return tasks
