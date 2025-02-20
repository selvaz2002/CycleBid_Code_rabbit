import { useState } from 'react'

import { EditorState } from 'draft-js'

import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

const EditorControlled = () => {
  const [value, setValue] = useState(EditorState.createEmpty())

  return <ReactDraftWysiwyg editorState={value} onEditorStateChange={data => setValue(data)} />
}

export default EditorControlled
