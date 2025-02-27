export const EditorControlledJSXCode = (<pre className='language-jsx'><code className='language-jsx'>{`
import { useState } from 'react'

// ** Third Party Imports
import { EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

const EditorControlled = () => {

  const [value, setValue] = useState(EditorState.createEmpty())

  return <ReactDraftWysiwyg editorState={value} onEditorStateChange={data => setValue(data)} />
}

export default EditorControlled
`}</code></pre>)

export const EditorUncontrolledJSXCode = (<pre className='language-jsx'><code className='language-jsx'>{`// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

const EditorUncontrolled = () => <ReactDraftWysiwyg />

export default EditorUncontrolled
`}</code></pre>)

