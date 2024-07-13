import React from 'react';
import Button from "./Button";
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

interface HeaderProps {
  focusedElement: HTMLDivElement | null;
  applyColorMap: (element: HTMLDivElement) => void;
}

const Header: React.FC<HeaderProps> = ({ focusedElement, applyColorMap }) => {
  const handleButtonClick = (action: string) => {
    if (!focusedElement) return;

    const viewport = cornerstone.getViewport(focusedElement);
    if (!viewport) {
      console.error('Viewport is undefined');
      return;
    }

    switch (action) {
      case 'Zoom':
        viewport.scale += 0.2;
        cornerstone.setViewport(focusedElement, viewport);
        break;
      case 'FlipH':
        viewport.hflip = !viewport.hflip;
        cornerstone.setViewport(focusedElement, viewport);
        break;
      case 'FlipV':
        viewport.vflip = !viewport.vflip;
        cornerstone.setViewport(focusedElement, viewport);
        break;
      case 'RotateDelta30':
        viewport.rotation += 30;
        cornerstone.setViewport(focusedElement, viewport);
        break;
      case 'Invert':
        viewport.invert = !viewport.invert;
        cornerstone.setViewport(focusedElement, viewport);
        break;
      case 'Reset':
        cornerstone.reset(focusedElement);
        break;
      case 'PreviousImage':
        changeImage(focusedElement, -1);
        break;
      case 'NextImage':
        changeImage(focusedElement, 1);
        break;
      case 'ApplyColormap':
        applyColorMap(focusedElement);
        break;
      default:
        break;
    }
  };

  const changeImage = (element: HTMLDivElement, direction: number) => {
    const toolState = cornerstoneTools.getToolState(element, 'stack');
    if (!toolState || !toolState.data || !toolState.data.length) {
      console.error('Tool state is not properly initialized.');
      return;
    }
    const stack = toolState.data[0];
    let newIndex = stack.currentImageIdIndex + direction;

    if (newIndex < 0) {
      newIndex = stack.imageIds.length - 1;
    } else if (newIndex >= stack.imageIds.length) {
      newIndex = 0;
    }

    cornerstone.loadImage(stack.imageIds[newIndex]).then((image) => {
      stack.currentImageIdIndex = newIndex;
      cornerstone.displayImage(element, image);
    });
  };

  return (
    <div className="flex justify-between items-center w-full h-[116px] py-[16px] pr-[40px] pl-[30px] gap-[48px] text-[16px]">
      <div className="text-[#697077]">
        Dicom Viewer(with Cornerstone.js)
      </div>

      <div className="flex items-center h-[48px] gap-[24px]">
        <div className="flex h-[40px] gap-[16px]">
          <Button label='Zoom' onPress={() => handleButtonClick('Zoom')} bgc="" py="py-[12px]" px="px-[8px]" />
          <Button label='Flip H' onPress={() => handleButtonClick('FlipH')} bgc="" py="py-[12px]" px="px-[8px]" />
          <Button label='Flip V' onPress={() => handleButtonClick('FlipV')} bgc="" py="py-[12px]" px="px-[8px]" />
          <Button label='Rotate Delta 30' onPress={() => handleButtonClick('RotateDelta30')} bgc="" py="py-[12px]" px="px-[8px]" />
          <Button label='Invert' onPress={() => handleButtonClick('Invert')} bgc="" py="py-[12px]" px="px-[8px]" />
          <Button label='Apply Colormap' onPress={() => handleButtonClick('ApplyColormap')} bgc="" py="py-[12px]" px="px-[8px]" />
          <Button label='Reset' onPress={() => handleButtonClick('Reset')} bgc="" py="py-[12px]" px="px-[8px]" />
        </div>

        <Button label='Previous Image' onPress={() => handleButtonClick('PreviousImage')} bgc="bg-[#0F62FE]" py="py-[16px]" px="px-[12px]" isNavigation={true} />
        <Button label='Next Image' onPress={() => handleButtonClick('NextImage')} bgc="bg-[#0F62FE]" py="py-[16px]" px="px-[12px]" isNavigation={true} />
      </div>
    </div>
  );
};

export default Header;
