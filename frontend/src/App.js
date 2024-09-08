import React, {useEffect, useState} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const staticData = [{
	"type": "bank-draft", "title": "Bank Draft", "position": 0

}, {"type": "bill-of-lading", "title": "Bill of Lading", "position": 1}, {
	"type": "invoice", "title":
		"Invoice", "position": 2
}, {"type": "bank-draft-2", "title": "Bank Draft 2", "position": 3}, {
	"type":
		"bill-of-lading-2", "title":
		"Bill of Lading 2", "position": 4
}]


// Define a type for the drag-and-drop items
const ItemType = 'CARD';

const DraggableCard = ({ data, index, moveCard, loading, imageUrl, onLoad, onError, onClick }) => {
  // Set up drag source
  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  // Set up drop target
  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index; // Update the dragged item's index
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="flex flex-col items-center border p-2 m-2 rounded shadow cursor-pointer"
      onClick={() => onClick(data, imageUrl)} // Trigger modal on click
    >
      <p>{data.title}</p>
      {loading && (
        <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-8 h-8 animate-spin mb-2"></div>
      )}
      <img
        src={imageUrl}
        alt={data.type}
        height="200px"
        width="200px"
        onLoad={onLoad}
        onError={onError}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );
};

const Modal = ({ isOpen, onClose, content }) => {
  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/2">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          ×
        </button>
        <h2 className="text-xl mb-4">{content?.title}</h2>
        <img src={content?.imageUrl} alt={content?.type} className="w-full h-auto" />
      </div>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState({});
  const [imageUrls, setImageUrls] = useState([]);
  const [items, setItems] = useState(staticData); // Initialize with your static data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Generate random image URLs once when the component mounts
  useEffect(() => {
    const generateRandomUrls = () => {
      return staticData.map(() => {
        const randomNumber = (min = 1, max = 100) => Math.floor(Math.random() * (max - min) + min);
        return `https://picsum.photos/id/${randomNumber()}/200`;
      });
    };

    // Initialize loading state for each image to true
    setImageUrls(generateRandomUrls());
    setLoading(staticData.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}));
  }, []);

  const handleImageLoad = (index) => {
    setLoading((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index) => {
    setLoading((prev) => ({ ...prev, [index]: false }));
  };

  // Function to move cards when dragged
  const moveCard = (fromIndex, toIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);

    // Update positions to maintain the logical order
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      position: index,
    }));

    setItems(reorderedItems);

    // Reorder image URLs based on the updated positions
    const updatedImageUrls = [...imageUrls];
    const [movedImage] = updatedImageUrls.splice(fromIndex, 1);
    updatedImageUrls.splice(toIndex, 0, movedImage);

    setImageUrls(updatedImageUrls);
  };

  const handleCardClick = (data, imageUrl) => {
    setModalContent({ ...data, imageUrl });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App grid grid-cols-3 gap-4 m-2">
        {items
          .sort((a, b) => a.position - b.position) // Sort items by position to render in the correct order
          .map((data, index) => (
            <DraggableCard
              key={`${data.title}-${index}`} // Use a combination of unique values for the key
              index={index}
              data={data}
              moveCard={moveCard}
              loading={loading[index]}
              imageUrl={imageUrls[index]}
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
              onClick={handleCardClick} // Pass onClick handler
            />
          ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} content={modalContent} />
    </DndProvider>
  );
}

export default App;
