import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Sortable, { generateSortable, sort } from './Sortable'

const wrap = klass => DragDropContext(HTML5Backend)(klass)

export default { Sortable, generateSortable, sort, wrap }
