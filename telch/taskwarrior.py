from taskw import TaskWarrior


def get_taskwarrior_instance():
    return TaskWarrior(marshal=True)


def get_tasks_matching(w, filter_dict):
    tasks = w.load_tasks(command='pending')
    return tasks['pending']
