import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload } from 'lucide-react'
import { Button } from "./components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Input } from "./components/ui/input"

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [filter, setFilter] = useState('none')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const applyFilter = useCallback(async () => {
    if (!selectedImage) return

    // In a real application, you would send this to your server
    // For now, we'll just set it to the same as the preview
    setProcessedImage(selectedImage)

    // Simulating server processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Here you would typically send the image to your server and get the processed image back
    // const formData = new FormData()
    // formData.append('image', selectedImage)
    // formData.append('filter', filter)
    // const response = await fetch('/api/apply_filter', {
    //   method: 'POST',
    //   body: formData,
    // })
    // const data = await response.json()
    // setProcessedImage(data.processed_image_url)
  }, [selectedImage, filter])

  const getFilterStyle = useCallback(() => {
    switch (filter) {
      case 'grayscale':
        return 'grayscale(100%)'
      case 'sepia':
        return 'sepia(100%)'
      case 'blur':
        return 'blur(5px)'
      default:
        return 'none'
    }
  }, [filter])

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Image Filter App</h1>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-500 mb-2" />
                <span className="text-sm text-gray-500">Upload Image</span>
              </div>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage}
                alt="Uploaded"
                className="w-full h-64 object-cover rounded-lg"
                style={{ filter: getFilterStyle() }}
              />
            </div>
          )}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select a filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Filter</SelectItem>
              <SelectItem value="grayscale">Grayscale</SelectItem>
              <SelectItem value="sepia">Sepia</SelectItem>
              <SelectItem value="blur">Blur</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={applyFilter}
            disabled={!selectedImage}
            className="w-full"
          >
            Apply Filter
          </Button>
        </div>
        <AnimatePresence>
          {processedImage && (
            <motion.div
              key="processed-image"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >
              <h2 className="text-xl font-semibold mb-2 text-center text-gray-700">Processed Image</h2>
              <img src={processedImage} alt="Processed" className="w-full rounded-lg shadow-md" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}