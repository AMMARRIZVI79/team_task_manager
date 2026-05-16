import { Task, Project, ProjectMember } from '../models/index.js';

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, dueDate, assignedTo } = req.body;

    // Check if project exists and user has access
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = project.ownerId.toString() === req.user.id ||
      await ProjectMember.findOne({
        projectId, userId: req.user.id
      }) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Create task from root /tasks endpoint (frontend sends project_id in body)
export const createTaskRoot = async (req, res) => {
  try {
    const { project_id, title, description, priority, dueDate, assigned_to } = req.body;
    // reuse logic but map names
    req.params.projectId = project_id;
    req.body = {
      title,
      description,
      priority,
      dueDate,
      assignedTo: assigned_to,
    };
    return await createTask(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists and user has access
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is project owner
    const isOwner = project.ownerId.toString() === req.user.id;
    
    // Check if user is project member and get their role
    const membership = await ProjectMember.findOne({
      projectId, userId: req.user.id
    });
    
    const isProjectAdmin = membership?.role === 'admin';
    const hasAccess = isOwner || membership || req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Filter tasks based on role
    let tasks;
    if (isOwner || isProjectAdmin || req.user.role === 'admin') {
      // Project admin/owner can see all tasks
      tasks = await Task.find({ projectId });
    } else {
      // Regular members see only tasks assigned to them
      tasks = await Task.find({ 
        projectId,
        assignedTo: req.user.id 
      });
    }

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving tasks' });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { project_id, status, assigned_to, priority } = req.query;
    const filter = {};
    if (project_id) filter.projectId = project_id;
    if (status) filter.status = status;
    if (assigned_to) filter.assignedTo = assigned_to;
    if (priority) filter.priority = priority;

    // If project filter is provided, ensure user has access
    if (project_id) {
      const project = await Project.findById(project_id);
      if (!project) return res.status(404).json({ message: 'Project not found' });

      const hasAccess = project.ownerId.toString() === req.user.id ||
        await ProjectMember.findOne({ projectId: project_id, userId: req.user.id }) ||
        req.user.role === 'admin';

      if (!hasAccess) return res.status(403).json({ message: 'Access denied' });
    }

    // If no project filter, non-admin users should only see tasks assigned to them
    if (!project_id && req.user.role !== 'admin') {
      filter.assignedTo = req.user.id;
    }

    const tasks = await Task.find(filter);

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving tasks' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.projectId);

    const hasAccess = project.ownerId.toString() === req.user.id ||
      await ProjectMember.findOne({
        projectId: task.projectId, userId: req.user.id
      }) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    
    await task.save();

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.projectId);

    const hasAccess = project.ownerId.toString() === req.user.id ||
      await ProjectMember.findOne({
        projectId: task.projectId, userId: req.user.id
      }) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    let tasks = [];

    // For all users (including admins), show only tasks assigned to them
    // This ensures consistency and clarity in the dashboard
    tasks = await Task.find({ assignedTo: userId });

    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(
        t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
      ).length,
    };

    res.json({
      message: 'Task statistics retrieved',
      stats,
      tasks: tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving task stats' });
  }
};
