import { useState } from 'react'
import { Box, Card, Button, Typography, Grid, Chip, Dialog, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import '../styles/dashboard-content.css'

const defaultTags = [
  { id: 1, name: 'Cybersecurity', color: '#ffa800', count: 12 },
  { id: 2, name: 'Data Protection', color: '#2b2a2a', count: 8 },
  { id: 3, name: 'Encryption', color: '#ffa800', count: 5 },
  { id: 4, name: 'Security Best Practices', color: '#2b2a2a', count: 6 },
  { id: 5, name: 'Risk Management', color: '#ffa800', count: 4 },
  { id: 6, name: 'Compliance', color: '#2b2a2a', count: 7 },
]

export default function BlogTags() {
  const [tags, setTags] = useState(defaultTags)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', color: '#ffa800' })

  const handleOpenDialog = (tag = null) => {
    if (tag) {
      setEditingId(tag.id)
      setFormData({ name: tag.name, color: tag.color })
    } else {
      setEditingId(null)
      setFormData({ name: '', color: '#ffa800' })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingId(null)
  }

  const handleSaveTag = () => {
    if (editingId) {
      setTags(tags.map((t) => (t.id === editingId ? { ...t, ...formData } : t)))
    } else {
      setTags([...tags, { ...formData, id: Date.now(), count: 0 }])
    }
    handleCloseDialog()
  }

  const handleDeleteTag = (id) => {
    setTags(tags.filter((t) => t.id !== id))
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
            Tags
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            className="add-button"
          >
            New Tag
          </Button>
        </Box>
        <Typography className="section-subtitle">
          Create and manage tags for your blog posts.
        </Typography>
      </Box>

      <Grid container spacing={2} className="tags-grid">
        {tags.map((tag) => (
          <Grid item xs={12} sm={6} md={4} key={tag.id}>
            <Card className="tag-card">
              <Box className="tag-header">
                <Box className="tag-name-row">
                  <Chip
                    label={tag.name}
                    style={{
                      backgroundColor: tag.color,
                      color: '#ffffff',
                      fontWeight: 600,
                    }}
                  />
                  <Typography className="tag-count">
                    {tag.count} posts
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteTag(tag.id)}
                  className="tag-delete-button"
                >
                  Delete
                </Button>
              </Box>
              <Box className="tag-footer">
                <Button
                  size="small"
                  onClick={() => handleOpenDialog(tag)}
                  className="tag-edit-button"
                >
                  Edit Tag
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Tag' : 'New Tag'}</DialogTitle>
        <DialogContent>
          <Box className="dialog-form" sx={{ mt: 2 }}>
            <TextField
              label="Tag Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <Box className="color-picker">
              <Typography className="color-label">Tag Color</Typography>
              <Box className="color-options">
                {['#ffa800', '#2b2a2a', '#d32f2f', '#1976d2', '#388e3c'].map((color) => (
                  <Box
                    key={color}
                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTag} variant="contained" color="primary">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
