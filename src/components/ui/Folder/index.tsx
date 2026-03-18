import folderIcon from '../../../assets/images/folder.png'

import './styles.css'

export default function Folder({
    label,
    // top,
    // left
}: {
    label: string,
    // top: number,
    // left: number
}) {
  return (
    <div
        className="folder"
        style={{
            // top: top,
            // left: left
        }}
    >
        <div className="folder-icon">
            <img src={folderIcon} alt={label} />
        </div>
        <div className="folder-label">{label}</div>
    </div>
  )
}
