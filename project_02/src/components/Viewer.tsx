import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';
import { useEffect, useRef, useState } from 'react';
import Header from './Header';


// wadouri 프로토콜을 통해 로드되는 DICOM 이미지 URL 배열
const baseUrl = 'http://localhost:5173/src/imgs/02ef8f31ea86a45cfce6eb297c274598/';

// 시리즈 폴더 이름 배열
const seriesFolders = ['series-000001', 'series-000002'];

// 각 시리즈 폴더 내의 모든 DICOM 파일 참조 생성
const imageIds = seriesFolders.map(seriesFolder => {
  const fileCount = 20; // 파일을 참조할 수 없어서 api로 불러와야함 임의로 설정한 값
  return Array.from({ length: fileCount }, (_, index) =>
    `wadouri:${baseUrl}${seriesFolder}/image-${(index + 1).toString().padStart(6, '0')}.dcm`
  );
});

const Viewer = () => {

  // DICOM 이미지가 표시될 div 요소에 대한 참조
  const element1Ref = useRef<HTMLDivElement | null>(null);
  const element2Ref = useRef<HTMLDivElement | null>(null);

  // 현재 포커스된 요소를 추적하기 위한 상태
  const [focusedElement, setFocusedElement] = useState<HTMLDivElement | null>(null);
  const [focusIndex, setFocusIndex] = useState(-1)
  const [colormapIndex, setColorMapIndex] = useState(0)

  const colormaps = [
    'hotIron',
    'pet',
    'hotMetalBlue',
    // 'pet20',
    'gray'
  ];

  useEffect(() => {
    // cornerstoneWADOImageLoader.external.cornerstone 에 cornerstone 의존성 주입 
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.Hammer = Hammer;

    // cornerstoneTools.init(); // ⭐

    

    const elements = [element1Ref.current, element2Ref.current];

    elements.forEach((element, index) => {
      if (element) {
        cornerstone.enable(element); // 요소 활성화

        // 시리즈의 첫 이미지 로드
        cornerstone.loadImage(imageIds[index][0]).then((image) => {
          cornerstone.displayImage(element, image);
          // addStackStateManager = 요소를 'stack'으로 묶음
          cornerstoneTools.addStackStateManager(element, ['stack']);
          // addToolState = 'stack'으로 묶은 요소들을 참조
          cornerstoneTools.addToolState(element, 'stack', {
            currentImageIdIndex: 0,
            imageIds: imageIds[index], // 올바른 2차원 배열 참조
          });

          // view 요소에 set
          const viewport = cornerstone.getDefaultViewportForImage(element, image);
          cornerstone.setViewport(element, viewport);

          // 이벤트 리스너 설정
          const handleResize = () => {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.setViewport(element, viewport);
          };

          window.addEventListener('resize', handleResize);

          // 컴포넌트 언마운트 시 이벤트 리스너 제거
          return () => {
            window.removeEventListener('resize', handleResize);
          };
        });

        // 클릭하면 포커스
        element.addEventListener('click', () => {
          setFocusIndex(index)
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

    const newIndex = (colormapIndex + 1) % 4
    setColorMapIndex(newIndex)
    viewport.colormap = colormaps[colormapIndex]; // 예시로 'hotIron' 컬러 맵 적용
    // viewport.colormap = 'hotIron'; // 예시로 'hotIron' 컬러 맵 적용
    cornerstone.setViewport(element, viewport);
    cornerstone.updateImage(element);
  };

  return (
    <div className='w-[1440px] h-[1024px] flex flex-col'>
      <Header focusedElement={focusedElement} applyColorMap={applyColorMap} />
      <div className='flex-grow flex w-full h-full gap-2'>
        <div ref={element1Ref} className={`flex-1 h-full cursor-pointer border-8 ${ focusIndex == 0 ? 'border-main' : 'border-[transparent]' }`}></div>
        <div ref={element2Ref} className={`flex-1 h-full cursor-pointer border-8 ${ focusIndex == 1 ? 'border-main' : 'border-[transparent]' }`}></div>
      </div>
    </div>
  );
};

export default Viewer;
