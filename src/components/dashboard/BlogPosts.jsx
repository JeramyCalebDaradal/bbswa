import { useState } from 'react'
import {
  Box,
  Card,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import '../styles/dashboard-content.css'

const defaultPosts = [
  {
    id: 1,
    title: 'Introduction to Cybersecurity',
    author: 'Demo User',
    category: 'Security',
    date: '2024-01-15',
    status: 'Published',
  },
  {
    id: 2,
    title: 'Best Practices for Data Protection',
    author: 'Demo User',
    category: 'Security',
    date: '2024-01-10',
    status: 'Published',
  },
  {
    id: 3,
    title: 'Understanding Encryption',
    author: 'Demo User',
    category: 'Technical',
    date: '2024-01-05',
    status: 'Draft',
  },
]

export default function BlogPosts() {
  const [posts, setPosts] = useState(defaultPosts)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    status: 'Draft',
  })

  const handleOpenDialog = (post = null) => {
    if (post) {
      setEditingId(post.id)
      setFormData(post)
    } else {
      setEditingId(null)
      setFormData({ title: '', author: '', category: '', status: 'Draft' })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingId(null)
    setFormData({ title: '', author: '', category: '', status: 'Draft' })
  }

  const handleSavePost = () => {
    if (editingId) {
      setPosts(posts.map((p) => (p.id === editingId ? { ...formData, id: editingId, date: p.date } : p)))
    } else {
      setPosts([...posts, { ...formData, id: Date.now(), date: new Date().toISOString().split('T')[0] }])
    }
    handleCloseDialog()
  }

  const handleDeletePost = (id) => {
    setPosts(posts.filter((p) => p.id !== id))
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Box className="dashboard-section">
      <Box className="section-header">
        <Box className="section-title-row">
          <Typography variant="h5" className="section-title">
            Blog Posts
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            className="add-button"
          >
            New Post
          </Button>
        </Box>
        <Typography className="section-subtitle">
          Manage and organize your blog posts.
        </Typography>
      </Box>

      <Card className="table-card">
        <Box className="table-wrapper">
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} className="table-row">
                  <TableCell className="title-cell">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.date}</TableCell>
                  <TableCell>
                    <Box className={`status-badge status-${post.status.toLowerCase()}`}>
                      {post.status}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box className="action-buttons">
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(post)}
                        className="edit-button"
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeletePost(post.id)}
                        className="delete-button"
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Post' : 'New Post'}</DialogTitle>
        <DialogContent>
          <Box className="dialog-form" sx={{ mt: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSavePost} variant="contained" color="primary">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
