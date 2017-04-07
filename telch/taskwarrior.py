from taskw import TaskWarrior


def get_taskwarrior_instance():
    return TaskWarrior(marshal=True)


def filter_tasks_by_field(tasks, key, value):
    result = []
    for x in tasks:
        if key == 'any':
            for y in x.values():
                try:
                    if value.lower() in str(y).lower():
                        result.append(x)
                        break
                except:
                    pass
        else:
            found_field = str(x.get(key, '')).lower()
            if value.lower() in found_field:
                result.append(x)
    return result


def get_tasks_matching(w, filter_dict):
    tasks = w.load_tasks(command='all')

    if 'status' in filter_dict:
        tasks = tasks[filter_dict['status'].lower()]
    else:
        tasks = tasks['pending'] + tasks['completed']

    if 'substring' in filter_dict:
        for key, value in filter_dict['substring'].items():
            tasks = filter_tasks_by_field(tasks, key, value)

    if 'sortby' in filter_dict:
        order = filter_dict.get('order', 'asc')
        key = filter_dict['sortby']
        tasks = sorted(tasks,
                       key=lambda x: x.get(key, ''),
                       reverse=order == 'desc')

    return tasks
