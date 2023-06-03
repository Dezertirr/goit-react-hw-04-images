import React, { useState } from 'react';
import { getSearchPhotoAPI } from './APIservice/APIService.js';
import SearchBar from './SearchBar/SearchBar.jsx';
import ImageGallery from './ImageGallery/ImageGallery.jsx';
import LoadMore from './LoadMore/LoadMore.jsx';
import CustomLoader from './Loader/Loader.jsx';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const App = () => {
  
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [page, setPage] = useState(1);

  const [totalHits, setTotalHits] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      setIsLoading(true);

      const response = await getSearchPhotoAPI(query);

      setImages(response.hits);
      setTotalHits(response.totalHits);
      setIsSubmitted(true);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const loadMoreButton = async (evt) => {
    evt.preventDefault();
    try {
      const response = await getSearchPhotoAPI(query, page + 1);
      setImages((prevImages) => [...prevImages, ...response.hits]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleChange = (evt) => {
    setQuery(evt.target.value);
  };

  return (
    <div>
      <SearchBar query={query} handleSubmit={handleSubmit} handleChange={handleChange} />
      {isLoading ? <CustomLoader /> : <ImageGallery images={images} isSubmitted={isSubmitted} />}
      {images.length > 0 && images.length + 1 <= totalHits && (
        <LoadMore loadMoreButton={loadMoreButton} />
      )}
    </div>
  );
};
