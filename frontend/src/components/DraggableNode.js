// DraggableNode.js
// A toolbar chip that can be dragged onto the canvas to create a node.

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event) => {
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="vs-chip"
      draggable
      onDragStart={onDragStart}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
    >
      <span className="vs-chip__dot" />
      <span className="vs-chip__label">{label}</span>
    </div>
  );
};
