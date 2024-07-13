import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';
import { useEffect, useRef, useState } from 'react';
import Header from './Header';

const imageIds = [
    'wadouri:http://localhost:5173/src/imgs/image-000001.dcm',
    'wadouri:http://localhost:5173/src/imgs/image-000002.dcm',
    'wadouri:http://localhost:5173/src/imgs/image-000003.dcm',
    'wadouri:http://localhost:5173/src/imgs/image-000004.dcm',
    'wadouri:http://localhost:5173/src/imgs/image-000005.dcm',
    'wadouri:http://localhost:5173/src/imgs/image-000006.dcm',
    'wadouri:http://localhost:5173/src/imgs/image-000007.dcm',
    'wadouri:http://localhost:5173/src/imgs/image-000008.dcm',
    'wadouri:http://localhost:5173/src/imgs/image-000009.dcm',
    'wadouri:http://localhost:5173/src/imgs/image-000010.dcm',
];

const Viewer = () => {
    const element1Ref = useRef<HTMLDivElement | null>(null);
    const element2Ref = useRef<HTMLDivElement | null>(null);
    const [focusedElement, setFocusedElement] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        cornerstoneTools.external.cornerstone = cornerstone;
        cornerstoneTools.external.Hammer = Hammer;
    
        cornerstoneTools.init();
    
    
        const elements = [element1Ref.current, element2Ref.current];
    
        elements.forEach((element, index) => {
          if (element) {
            cornerstone.enable(element);
    
            cornerstone.loadImage(imageIds[index]).then((image) => {
              cornerstone.displayImage(element, image);
              cornerstoneTools.addStackStateManager(element, ['stack']);
              cornerstoneTools.addToolState(element, 'stack', {
                currentImageIdIndex: 0,
                imageIds: imageIds,
              });
    
              // 줌과 팬 도구 활성화
    
              const viewport = cornerstone.getDefaultViewportForImage(element, image);
              cornerstone.setViewport(element, viewport);
    
              const handleResize = () => {
                const viewport = cornerstone.getDefaultViewportForImage(element, image);
                cornerstone.setViewport(element, viewport);
              };
    
              window.addEventListener('resize', handleResize);
    
              return () => {
                window.removeEventListener('resize', handleResize);
              };
            });
    
            element.addEventListener('click', () => {
              setFocusedElement(element);
            });
          }
        });
      }, []);

    const applyColorMap = (element: HTMLDivElement) => {
        const viewport = cornerstone.getViewport(element);
        if (!viewport) {
            console.error('Viewport is undefined');
            return;
        }

        viewport.colormap = 'hotIron'; // 예시로 'hotIron' 컬러 맵 적용
        cornerstone.setViewport(element, viewport);
        cornerstone.updateImage(element);
    };

    return (
        <div className='w-[1440px] h-[1024px] flex flex-col'>
            <Header focusedElement={focusedElement} applyColorMap={applyColorMap} />
            <div className='flex-grow flex w-full h-full gap-2'>
                <div ref={element1Ref} className='flex-1 h-full border border-gray-400'></div>
                <div ref={element2Ref} className='flex-1 h-full border border-gray-400'></div>
            </div>
        </div>
    );
};

export default Viewer;
