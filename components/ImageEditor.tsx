// "use client";

// import { useEffect, useRef, useState, useCallback, ChangeEvent } from "react";
// import { fabric } from "fabric";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Slider } from "@/components/ui/slider";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { Label } from "@/components/ui/label";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Type,
//   Trash,
//   Upload,
//   ZoomIn,
//   ZoomOut,
//   Download,
//   Undo,
//   Redo,
//   Sliders,
//   AlignCenter,
//   AlignLeft,
//   AlignRight,
//   Palette,
//   Move,
//   Image as ImageIcon,
//   RotateCcw,
//   Sun,
//   Moon,
// } from "lucide-react";

// // Notification Interface
// interface Notification {
//   id: number;
//   message: string;
//   type: "success" | "error";
// }

// const ImageEditor: React.FC = () => {
//   const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
//   const [selectedColor, setSelectedColor] = useState<string>("#333333");
//   const [selectedFontSize, setSelectedFontSize] = useState<number>(30);
//   const [history, setHistory] = useState<string[]>([]);
//   const [redoStack, setRedoStack] = useState<string[]>([]);
//   const [zoomLevel, setZoomLevel] = useState<number>(100);
//   const [selectedTool, setSelectedTool] = useState<string>("select");
//   const [brushSize, setBrushSize] = useState<number>(5);
//   const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
//   const [saveFormat, setSaveFormat] = useState<"png" | "jpeg">("png");
//   const [filename, setFilename] = useState<string>("image");
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   // Notification Function
//   const showNotification = (message: string, type: "success" | "error"): void => {
//     const id: number = Date.now();
//     setNotifications((prev) => [...prev, { id, message, type }]);
//     setTimeout(() => {
//       setNotifications((prev) => prev.filter((n) => n.id !== id));
//     }, 3000);
//   };

//   useEffect(() => {
//     const setupCanvas = (): void => {
//       if (canvasRef.current) {
//         const fabricCanvas: fabric.Canvas = new fabric.Canvas(canvasRef.current, {
//           backgroundColor: isDarkMode ? "#1a1a1a" : "white",
//           preserveObjectStacking: true,
//           selection: true,
//           width: 800,
//           height: 600,
//         });
//         setCanvas(fabricCanvas);
//         fabricCanvas.on("object:modified", saveHistory);
//         fabricCanvas.on("object:added", saveHistory);
//         fabricCanvas.on("object:removed", saveHistory);
//       }
//     };

//     setupCanvas();

//     return () => {
//       if (canvas) {
//         canvas.dispose();
//       }
//     };
//   }, [isDarkMode, canvas]);

//   const saveHistory = useCallback((): void => {
//     if (canvas) {
//       const json: fabric.ICanvasOptions = canvas.toJSON();
//       setHistory((prev) => [...prev, JSON.stringify(json)]);
//       setRedoStack([]);
//     }
//   }, [canvas]);

//   const undo = (): void => {
//     if (history.length > 0 && canvas) {
//       const lastState: string = history[history.length - 1];
//       setRedoStack((prev) => [JSON.stringify(canvas.toJSON()), ...prev]);
//       setHistory((prev) => prev.slice(0, -1));
//       canvas.loadFromJSON(lastState, () => {
//         canvas.renderAll();
//         saveHistory();
//       });
//       showNotification("Undo successful", "success");
//     } else {
//       showNotification("No more actions to undo", "error");
//     }
//   };

//   const redo = (): void => {
//     if (redoStack.length > 0 && canvas) {
//       const nextState: string = redoStack[0];
//       setHistory((prev) => [...prev, JSON.stringify(canvas.toJSON())]);
//       setRedoStack((prev) => prev.slice(1));
//       canvas.loadFromJSON(nextState, () => {
//         canvas.renderAll();
//         saveHistory();
//       });
//       showNotification("Redo successful", "success");
//     } else {
//       showNotification("No more actions to redo", "error");
//     }
//   };

//   const addText = (): void => {
//     if (canvas) {
//       const text: fabric.IText = new fabric.IText("Your Text Here", {
//         left: canvas.width / 2,
//         top: canvas.height / 2,
//         fill: selectedColor,
//         fontSize: selectedFontSize,
//         originX: "center",
//         originY: "center",
//       });
//       canvas.add(text);
//       canvas.setActiveObject(text);
//       canvas.renderAll();
//       saveHistory();
//       showNotification("Text added", "success");
//     }
//   };

//   const deleteSelected = (): void => {
//     if (canvas) {
//       const activeObjects: fabric.Object[] = canvas.getActiveObjects();
//       if (activeObjects.length > 0) {
//         activeObjects.forEach((obj: fabric.Object) => canvas.remove(obj));
//         canvas.discardActiveObject();
//         canvas.renderAll();
//         saveHistory();
//         showNotification("Selected objects deleted", "success");
//       } else {
//         showNotification("No objects selected", "error");
//       }
//     }
//   };

//   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
//     const file: File | undefined = e.target.files?.[0];
//     if (file && canvas) {
//       const reader: FileReader = new FileReader();
//       reader.onload = (event: ProgressEvent<FileReader>): void => {
//         if (event.target?.result && typeof event.target.result === "string") {
//           fabric.Image.fromURL(event.target.result, (img: fabric.Image) => {
//             img.scaleToWidth(canvas.width / 2);
//             img.set({
//               left: canvas.width / 2,
//               top: canvas.height / 2,
//               originX: "center",
//               originY: "center",
//             });
//             canvas.add(img);
//             canvas.setActiveObject(img);
//             canvas.renderAll();
//             saveHistory();
//             showNotification("Image uploaded successfully", "success");
//           });
//         } else {
//           showNotification("Failed to upload image", "error");
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const alignText = (alignment: "left" | "center" | "right"): void => {
//     if (canvas) {
//       const activeObject: fabric.Object | undefined = canvas.getActiveObject();
//       if (activeObject && activeObject.type === "i-text") {
//         const textObject: fabric.IText = activeObject as fabric.IText;
//         textObject.set({ textAlign: alignment });
//         canvas.renderAll();
//         saveHistory();
//         showNotification(`Text aligned ${alignment}`, "success");
//       } else {
//         showNotification("No text object selected", "error");
//       }
//     }
//   };

//   const handleZoom = (zoomIn: boolean): void => {
//     if (canvas) {
//       let zoom: number = canvas.getZoom();
//       zoom = zoomIn ? zoom * 1.1 : zoom * 0.9;
//       zoom = Math.max(0.5, Math.min(zoom, 3)); // Clamp zoom between 50% and 300%
//       canvas.setZoom(zoom);
//       setZoomLevel(Math.round(zoom * 100));
//       canvas.renderAll();
//       showNotification(
//         `Zoom ${zoomIn ? "increased" : "decreased"} to ${Math.round(zoom * 100)}%`,
//         "success"
//       );
//     }
//   };

//   const saveImage = (): void => {
//     if (canvas) {
//       const dataURL: string = canvas.toDataURL({
//         format: saveFormat,
//         quality: 1,
//         multiplier: 1,
//       });
//       const link: HTMLAnchorElement = document.createElement("a");
//       link.href = dataURL;
//       link.download = `${filename}.${saveFormat}`;
//       link.click();
//       showNotification("Image saved successfully", "success");
//     }
//   };

//   const applyFilter = (filterType: "grayscale" | "sepia" | "invert"): void => {
//     if (canvas) {
//       const activeObject: fabric.Object | undefined = canvas.getActiveObject();
//       if (activeObject && activeObject.type === "image") {
//         const img: fabric.Image = activeObject as fabric.Image;
//         img.filters = []; // Clear existing filters
//         switch (filterType) {
//           case "grayscale":
//             img.filters.push(new fabric.Image.filters.Grayscale());
//             break;
//           case "sepia":
//             img.filters.push(new fabric.Image.filters.Sepia());
//             break;
//           case "invert":
//             img.filters.push(new fabric.Image.filters.Invert());
//             break;
//           default:
//             break;
//         }
//         img.applyFilters();
//         canvas.renderAll();
//         saveHistory();
//         showNotification(`${capitalize(filterType)} filter applied`, "success");
//       } else {
//         showNotification("No image selected", "error");
//       }
//     }
//   };

//   const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

//   const toggleDrawingMode = (): void => {
//     if (canvas) {
//       const newDrawingMode: boolean = !isDrawingMode;
//       setIsDrawingMode(newDrawingMode);
//       canvas.isDrawingMode = newDrawingMode;
//       if (canvas.freeDrawingBrush) {
//         canvas.freeDrawingBrush.width = brushSize;
//         canvas.freeDrawingBrush.color = selectedColor;
//       }
//       showNotification(`Drawing mode ${newDrawingMode ? "enabled" : "disabled"}`, "success");
//     }
//   };

//   const handleToolChange = (tool: string): void => {
//     setSelectedTool(tool);
//     if (canvas) {
//       switch (tool) {
//         case "draw":
//           toggleDrawingMode();
//           break;
//         case "select":
//           if (isDrawingMode) toggleDrawingMode();
//           showNotification("Select mode enabled", "success");
//           break;
//         default:
//           break;
//       }
//     }
//   };

//   const rotateObject = (): void => {
//     if (canvas) {
//       const activeObject: fabric.Object | undefined = canvas.getActiveObject();
//       if (activeObject) {
//         activeObject.rotate((activeObject.angle || 0) + 45);
//         canvas.renderAll();
//         saveHistory();
//         showNotification("Object rotated 45 degrees", "success");
//       } else {
//         showNotification("No object selected", "error");
//       }
//     }
//   };

//   const toggleTheme = (): void => {
//     setIsDarkMode((prev) => !prev);
//     if (canvas) {
//       canvas.setBackgroundColor(!isDarkMode ? "#1a1a1a" : "white", canvas.renderAll.bind(canvas));
//       showNotification(`Switched to ${!isDarkMode ? "Dark" : "Light"} mode`, "success");
//     }
//   };

//   return (
//     <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} p-6 min-h-screen transition-colors`}>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-center text-3xl font-semibold">Zyke Image Editor</h1>
//         <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle Theme">
//           {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//         </Button>
//       </div>
//       <div className="editor-container flex flex-col items-center">
//         {/* Controls Section */}
//         <div className="controls flex flex-wrap gap-4 justify-center mb-4">
//           {/* Tool Selection */}
//           <ToggleGroup
//             type="single"
//             value={selectedTool}
//             onValueChange={handleToolChange}
//             aria-label="Tool Selection"
//           >
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <ToggleGroupItem value="select" aria-label="Select tool">
//                   <Move className="h-4 w-4" />
//                 </ToggleGroupItem>
//               </TooltipTrigger>
//               <TooltipContent>Select Tool</TooltipContent>
//             </Tooltip>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <ToggleGroupItem value="draw" aria-label="Draw tool">
//                   <Palette className="h-4 w-4" />
//                 </ToggleGroupItem>
//               </TooltipTrigger>
//               <TooltipContent>Draw Tool</TooltipContent>
//             </Tooltip>
//           </ToggleGroup>

//           {/* Add Text */}
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={addText}>
//                 <Type className="mr-2 h-4 w-4" /> Add Text
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Add some text to the canvas</TooltipContent>
//           </Tooltip>

//           {/* Font Size Slider */}
//           <Popover>
//             <PopoverTrigger asChild>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button variant="outline">
//                     <Sliders className="mr-2 h-4 w-4" /> Font Size
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Adjust Font Size</TooltipContent>
//               </Tooltip>
//             </PopoverTrigger>
//             <PopoverContent className="w-80">
//               <Slider
//                 defaultValue={[selectedFontSize]}
//                 max={100}
//                 step={1}
//                 onValueChange={(value: number[]) => setSelectedFontSize(value[0])}
//               />
//               <div className="mt-2 text-center">{selectedFontSize}px</div>
//             </PopoverContent>
//           </Popover>

//           {/* Color Picker */}
//           <div className="flex items-center space-x-2">
//             <Label htmlFor="color-picker">Color:</Label>
//             <Input
//               type="color"
//               id="color-picker"
//               value={selectedColor}
//               onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedColor(e.target.value)}
//               className="w-10 h-10 p-0 border-none"
//             />
//           </div>

//           {/* Upload Image */}
//           <Input
//             type="file"
//             onChange={handleImageUpload}
//             className="hidden"
//             id="upload-image"
//             accept="image/*"
//           />
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={() => document.getElementById("upload-image")?.click()}>
//                 <Upload className="mr-2 h-4 w-4" /> Upload Image
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Upload an image</TooltipContent>
//           </Tooltip>

//           {/* Delete Selected */}
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={deleteSelected}>
//                 <Trash className="mr-2 h-4 w-4" /> Delete Selected
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Delete selected objects from the canvas</TooltipContent>
//           </Tooltip>

//           {/* Undo */}
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={undo}>
//                 <Undo className="mr-2 h-4 w-4" /> Undo
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Undo the last action</TooltipContent>
//           </Tooltip>

//           {/* Redo */}
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={redo}>
//                 <Redo className="mr-2 h-4 w-4" /> Redo
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Redo the last action</TooltipContent>
//           </Tooltip>

//           {/* Align Left */}
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={() => alignText("left")}>
//                 <AlignLeft className="mr-2 h-4 w-4" /> Align Left
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Align text to the left</TooltipContent>
//           </Tooltip>

//           {/* Align Center */}
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={() => alignText("center")}>
//                 <AlignCenter className="mr-2 h-4 w-4" /> Align Center
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Align text to the center</TooltipContent>
//           </Tooltip>

//           {/* Align Right */}
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={() => alignText("right")}>
//                 <AlignRight className="mr-2 h-4 w-4" /> Align Right
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Align text to the right</TooltipContent>
//           </Tooltip>

//           {/* Rotate */}
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={rotateObject}>
//                 <RotateCcw className="mr-2 h-4 w-4" /> Rotate
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Rotate object 45 degrees</TooltipContent>
//           </Tooltip>
//         </div>

//         {/* Filters Section */}
//         <div className="filters flex gap-4 mb-4">
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={() => applyFilter("grayscale")}>
//                 <ImageIcon className="mr-2 h-4 w-4" /> Grayscale
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Apply grayscale filter</TooltipContent>
//           </Tooltip>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={() => applyFilter("sepia")}>
//                 <ImageIcon className="mr-2 h-4 w-4" /> Sepia
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Apply sepia filter</TooltipContent>
//           </Tooltip>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={() => applyFilter("invert")}>
//                 <ImageIcon className="mr-2 h-4 w-4" /> Invert
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Apply invert filter</TooltipContent>
//           </Tooltip>
//         </div>

//         {/* Canvas Container */}
//         <div
//           className={`canvas-container border ${
//             isDarkMode ? "border-gray-700" : "border-gray-300"
//           } bg-white dark:bg-gray-800 w-full max-w-3xl h-[600px] overflow-hidden`}
//         >
//           <canvas ref={canvasRef} />
//         </div>

//         {/* Zoom Controls */}
//         <div className="zoom-controls flex gap-4 mt-4 items-center">
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={() => handleZoom(false)}>
//                 <ZoomOut className="mr-2 h-4 w-4" /> Zoom Out
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Zoom out</TooltipContent>
//           </Tooltip>
//           <span className="text-sm font-medium">{zoomLevel}%</span>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button onClick={() => handleZoom(true)}>
//                 <ZoomIn className="mr-2 h-4 w-4" /> Zoom In
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>Zoom in</TooltipContent>
//           </Tooltip>

//           {/* Save Image Dialog */}
//           <Dialog>
//             <DialogTrigger asChild>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button>
//                     <Download className="mr-2 h-4 w-4" /> Save Image
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Save image</TooltipContent>
//               </Tooltip>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Save Image</DialogTitle>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 {/* Filename Input */}
//                 <div className="flex flex-col">
//                   <Label htmlFor="filename">Filename</Label>
//                   <Input
//                     id="filename"
//                     placeholder="Filename"
//                     value={filename}
//                     onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                       setFilename(e.target.value)
//                     }
//                   />
//                 </div>

//                 {/* Format Selection */}
//                 <div className="flex flex-col">
//                   <Label htmlFor="format">Format</Label>
//                   <Select
//                     onValueChange={(value: string) =>
//                       setSaveFormat(value as "png" | "jpeg")
//                     }
//                     defaultValue="png"
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select format" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="png">PNG</SelectItem>
//                       <SelectItem value="jpeg">JPEG</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Save Button */}
//                 <Button onClick={saveImage} className="mt-2">
//                   Save
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {/* Notifications */}
//       <div className="fixed bottom-4 right-4 flex flex-col-reverse gap-2">
//         {notifications.map((notification: Notification) => (
//           <div
//             key={notification.id}
//             className={`p-4 rounded-md shadow-md transition-opacity ${
//               notification.type === "success" ? "bg-green-500" : "bg-red-500"
//             } text-white`}
//           >
//             {notification.message}
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <footer className="text-center mt-10 text-gray-600 dark:text-gray-400">
//         &copy; 2024 Zyke Image Editor. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default ImageEditor;
