import { useState } from 'react'
import { Box, Card, Button, Typography, Grid, Dialog, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Folder as FolderIcon } from '@mui/icons-material'
import '../styles/dashboard-content.css'

const defaultCategories = [
  { id: 1, name: 'Security', description: 'Security-related articles and insights', postsCount: 12 },
  { id: 2, name: 'Technical', description: 'Technical how-to guides and tutorials', postsCount: 8 },
  { id: 3, name: 'Industry News', description: 'Latest news from the industry', postsCount: 5 },
  { id: 4, name: 'Best Practices', description: 'Best practices and recommendations', postsCount: 6 },
  { id: 5, name: 'Case Studies', description: 'Real-world case studies and examples', postsCount: 3 },
]

export default function BlogCategories() {
  const [categories, setCategories] = useState(defaultCategories)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingId(category.id)
      setFormData({ name: category.name, description: category.description })
    } else {
      setEditingId(null)
      setFormData({ name: '', description: '' })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingId(null)
  }

  const handleSaveCategory = () => {
    if (editingId) {
      setCategories(categories.map((c) => (c.id === editingId ? { ...c, ...formData } : c)))
    } else {
      setCategories([...categories, { ...formData, id: Date.now(), postsCount: 0 }])
    }
    handleCloseDialog()
  }

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id))
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
            Categories
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            className="add-button"
          >
            New Category
          </Button>
        </Box>
        <Typography className="section-subtitle">
          Organize your blog posts into categories.
        </Typography>
      </Box>

      <Grid container spacing={2} className="categories-grid">
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card className="category-card">
              <Box className="category-icon-box">
                <FolderIcon className="category-icon" />
              </Box>
              <Typography variant="h6" className="category-name">
                {category.name}
              </Typography>
              <Typography className="category-description">
                {category.description}
              </Typography>
              <Box className="category-footer">
                <Typography className="category-count">
                  {category.postsCount} posts
                </Typography>
              </Box>
              <Box className="category-actions">
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(category)}
                  className="category-edit-button"
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteCategory(category.id)}
                  className="category-delete-button"
                >
                  Delete
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Category' : 'New Category'}</DialogTitle>
        <DialogContent>
          <Box className="dialog-form" sx={{ mt: 2 }}>
            <TextField
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained" color="primary">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
