import React, {useEffect, useState} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

// Define a type for the drag-and-drop items
const ItemType = 'CARD';

const DraggableCard = ({data, index, moveCard, loading, imageUrl, onLoad, onError, onClick}) => {
	// Set up drag source
	const [, drag] = useDrag({
		type: ItemType,
		item: {index},
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
				style={{display: loading ? 'none' : 'block'}}
			/>
		</div>
	);
};

const Modal = ({isOpen, onClose, content}) => {
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
				<img src={content?.imageUrl} alt={content?.type} className="w-full h-auto"/>
			</div>
		</div>
	);
};

function App() {
	const [items, setItems] = useState([]); // Initialize with your static data
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState(null);

	// Fetch data from the mock API
	useEffect(() => {
		(async () => {
			const response = await fetch('/api/items');
			const data = await response.json();

			const dataWithImageUrls = data.map(item => {
				item.imageUrl = `https://picsum.photos/id/${item.position}/200`
				item.imageLoading = true
				return item;
			})

			setItems(dataWithImageUrls);
		})()
	}, []);

	const handleImageLoad = (index) => {
    setItems(prev => {
      const updatedItems = [...prev];
      updatedItems[index].imageLoading = false; // Mark as loaded
      return updatedItems;
    });
  };

  const handleImageError = (index) => {
    setItems(prev => {
      const updatedItems = [...prev];
      updatedItems[index].imageLoading = false; // Mark as loaded even if there's an error
      return updatedItems;
    });
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
	};

	const handleCardClick = (data, imageUrl) => {
		setModalContent({...data, imageUrl});
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="App">
			<DndProvider backend={HTML5Backend}>
				<div className="grid grid-cols-3 gap-4 m-2">
					{items
						.sort((a, b) => a.position - b.position) // Sort items by position to render in the correct order
						.map((data, index) => (
							<DraggableCard
								key={`${data.title}-${index}`} // Use a combination of unique values for the key
								index={index}
								data={data}
								moveCard={moveCard}
								loading={data.imageLoading}
								imageUrl={data.imageUrl}
								onLoad={() => handleImageLoad(index)}
								onError={() => handleImageError(index)}
								onClick={handleCardClick} // Pass onClick handler
							/>
						))}
				</div>
				<Modal isOpen={isModalOpen} onClose={handleCloseModal} content={modalContent}/>
			</DndProvider>
		</div>
	);
}

export default App;
