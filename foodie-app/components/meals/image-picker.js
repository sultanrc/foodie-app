"use client";
import { useRef, useState } from "react";
import classes from "./image-picker.module.css";
import Image from "next/image";

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState();
  const ImageInput = useRef();
  function handleClick() {
    ImageInput.current.click();
  }
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) {
      setPickedImage(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPickedImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet!</p>}
          {pickedImage && <Image src={pickedImage} alt="Picked Image" fill />}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpg, image/jpeg"
          name={name}
          ref={ImageInput}
          onChange={handleImageChange}
          required
        />
        <button type="button" className={classes.button} onClick={handleClick}>
          Pick an Image
        </button>
      </div>
    </div>
  );
}
