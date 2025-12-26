import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, Play, X } from 'lucide-react'

export default function ImageUpload() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [buildStatus, setBuildStatus] = useState('idle') // idle, processing, building, complete

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onload = () => setPreviewUrl(reader.result)
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1
  })

  const handleBuild = async () => {
    setBuildStatus('processing')
    // TODO: API 호출 구현
    setTimeout(() => {
      setBuildStatus('building')
      setTimeout(() => setBuildStatus('complete'), 3000)
    }, 2000)
  }

  const handleClear = () => {
    setUploadedImage(null)
    setPreviewUrl(null)
    setBuildStatus('idle')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">AI 빌더</h2>
        <p className="text-gray-400">이미지를 업로드하여 3D 건축물로 변환하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="text-blue-500" size={24} />
            <h3 className="text-lg font-semibold">이미지 업로드</h3>
          </div>

          {!uploadedImage ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-dark-border hover:border-blue-500/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              {isDragActive ? (
                <p className="text-blue-400">이미지를 여기에 놓으세요...</p>
              ) : (
                <>
                  <p className="text-gray-400 mb-2">
                    이미지를 드래그하거나 클릭하여 업로드
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, WebP 지원 (최대 10MB)
                  </p>
                </>
              )}
            </div>
          ) : (
            <div>
              <div className="relative border border-dark-border rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain bg-dark-bg"
                />
                <button
                  onClick={handleClear}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                파일: {uploadedImage.name}
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Play className="text-green-500" size={24} />
            <h3 className="text-lg font-semibold">건축 설정</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">건축 크기</label>
              <select className="input-field">
                <option>작음 (16x16)</option>
                <option>중간 (32x32)</option>
                <option>큼 (64x64)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">건축 높이</label>
              <select className="input-field">
                <option>낮음 (16블록)</option>
                <option>중간 (32블록)</option>
                <option>높음 (64블록)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">블록 스타일</label>
              <select className="input-field">
                <option>자동 (AI 추천)</option>
                <option>현실적</option>
                <option>픽셀아트</option>
                <option>추상적</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                onClick={handleBuild}
                disabled={!uploadedImage || buildStatus !== 'idle'}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buildStatus === 'idle' && '건축 시작'}
                {buildStatus === 'processing' && 'AI 분석 중...'}
                {buildStatus === 'building' && '건축 중...'}
                {buildStatus === 'complete' && '건축 완료!'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {buildStatus !== 'idle' && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">건축 진행 상황</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>AI 이미지 분석</span>
              <span className={buildStatus === 'processing' || buildStatus === 'building' || buildStatus === 'complete' ? 'text-green-500' : 'text-gray-500'}>
                {buildStatus === 'processing' || buildStatus === 'building' || buildStatus === 'complete' ? '완료' : '대기 중'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>3D 좌표 생성</span>
              <span className={buildStatus === 'building' || buildStatus === 'complete' ? 'text-green-500' : 'text-gray-500'}>
                {buildStatus === 'building' || buildStatus === 'complete' ? '완료' : '대기 중'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>마인크래프트 건축</span>
              <span className={buildStatus === 'complete' ? 'text-green-500' : 'text-gray-500'}>
                {buildStatus === 'complete' ? '완료' : '대기 중'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
