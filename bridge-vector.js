/**
 * 桥梁向量图形模块 - 使用SVG绘制桥梁监测系统
 * 替代原来的Three.js 3D模型，提供更高效的显示方式
 */

// 桥梁向量图形模块
const BridgeVector = (function() {
    // 配置参数
    const config = {
        container: null,
        width: 0,
        height: 0,
        colors: {
            normal: '#4cd964',
            warning: '#ffcc00',
            danger: '#ff3b30',
            offline: '#8e8e93',
            bridge: '#7b7b7b',
            background: '#f8f9fa',
            hover: 'rgba(0, 122, 255, 0.3)',
            selected: 'rgba(0, 122, 255, 0.5)'
        },
        animationDuration: 300,
    };

    // 数据存储
    const data = {
        sensors: [],
        selectedSensor: null,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        offset: { x: 0, y: 0 },
        zoomLevel: 1,
        maxZoom: 3,
        minZoom: 0.5,
        zoomStep: 0.1,
    };

    // SVG命名空间
    const svgNS = "http://www.w3.org/2000/svg";
    
    // SVG元素引用
    let svg = null;
    let bridgeGroup = null;
    let sensorsGroup = null;
    let tooltipGroup = null;
    
    /**
     * 初始化SVG
     */
    function initSVG() {
        // 获取容器尺寸
        config.width = config.container.clientWidth;
        config.height = config.container.clientHeight;
        
        // 创建SVG元素
        svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", `0 0 ${config.width} ${config.height}`);
        svg.style.backgroundColor = config.colors.background;
        
        // 创建分组
        bridgeGroup = document.createElementNS(svgNS, "g");
        bridgeGroup.setAttribute("id", "bridge-structure");
        
        sensorsGroup = document.createElementNS(svgNS, "g");
        sensorsGroup.setAttribute("id", "sensors-group");
        
        tooltipGroup = document.createElementNS(svgNS, "g");
        tooltipGroup.setAttribute("id", "tooltip-group");
        tooltipGroup.style.pointerEvents = "none";
        
        // 添加到SVG
        svg.appendChild(bridgeGroup);
        svg.appendChild(sensorsGroup);
        svg.appendChild(tooltipGroup);
        
        // 添加到容器
        config.container.innerHTML = "";
        config.container.appendChild(svg);
        
        // 添加事件监听
        svg.addEventListener("mousedown", onMouseDown);
        svg.addEventListener("mouseup", onMouseUp);
        svg.addEventListener("mousemove", onMouseMove);
        svg.addEventListener("wheel", onWheel);
        
        console.log("SVG初始化完成，尺寸:", config.width, "x", config.height);
    }
    
    /**
     * 绘制桥梁结构
     */
    function drawBridge() {
        // 清空现有内容
        bridgeGroup.innerHTML = "";
        
        // 计算桥梁尺寸和位置
        const bridgeWidth = config.width * 0.8;
        const bridgeHeight = config.height * 0.6;
        const startX = (config.width - bridgeWidth) / 2;
        const startY = config.height * 0.6;
        
        // 创建主桥面
        const bridgeDeck = document.createElementNS(svgNS, "path");
        bridgeDeck.setAttribute("d", `M ${startX} ${startY} L ${startX + bridgeWidth} ${startY}`);
        bridgeDeck.setAttribute("stroke", config.colors.bridge);
        bridgeDeck.setAttribute("stroke-width", "8");
        bridgeDeck.setAttribute("fill", "none");
        
        // 创建桥塔
        const tower1X = startX + bridgeWidth * 0.25;
        const tower2X = startX + bridgeWidth * 0.75;
        const towerHeight = bridgeHeight;
        const towerWidth = 10;
        
        const tower1 = document.createElementNS(svgNS, "rect");
        tower1.setAttribute("x", tower1X - towerWidth/2);
        tower1.setAttribute("y", startY - towerHeight);
        tower1.setAttribute("width", towerWidth);
        tower1.setAttribute("height", towerHeight);
        tower1.setAttribute("fill", config.colors.bridge);
        
        const tower2 = document.createElementNS(svgNS, "rect");
        tower2.setAttribute("x", tower2X - towerWidth/2);
        tower2.setAttribute("y", startY - towerHeight);
        tower2.setAttribute("width", towerWidth);
        tower2.setAttribute("height", towerHeight);
        tower2.setAttribute("fill", config.colors.bridge);
        
        // 创建拉索
        const numCables = 8;
        for (let i = 0; i < numCables; i++) {
            // 塔1左侧拉索
            const cable1Left = document.createElementNS(svgNS, "line");
            const cableOffset = (bridgeWidth * 0.2) / numCables;
            cable1Left.setAttribute("x1", tower1X);
            cable1Left.setAttribute("y1", startY - towerHeight * 0.8);
            cable1Left.setAttribute("x2", startX + i * cableOffset);
            cable1Left.setAttribute("y2", startY);
            cable1Left.setAttribute("stroke", config.colors.bridge);
            cable1Left.setAttribute("stroke-width", "2");
            
            // 塔1右侧拉索
            const cable1Right = document.createElementNS(svgNS, "line");
            cable1Right.setAttribute("x1", tower1X);
            cable1Right.setAttribute("y1", startY - towerHeight * 0.8);
            cable1Right.setAttribute("x2", tower1X + (i + 1) * cableOffset);
            cable1Right.setAttribute("y2", startY);
            cable1Right.setAttribute("stroke", config.colors.bridge);
            cable1Right.setAttribute("stroke-width", "2");
            
            // 塔2左侧拉索
            const cable2Left = document.createElementNS(svgNS, "line");
            cable2Left.setAttribute("x1", tower2X);
            cable2Left.setAttribute("y1", startY - towerHeight * 0.8);
            cable2Left.setAttribute("x2", tower2X - (i + 1) * cableOffset);
            cable2Left.setAttribute("y2", startY);
            cable2Left.setAttribute("stroke", config.colors.bridge);
            cable2Left.setAttribute("stroke-width", "2");
            
            // 塔2右侧拉索
            const cable2Right = document.createElementNS(svgNS, "line");
            cable2Right.setAttribute("x1", tower2X);
            cable2Right.setAttribute("y1", startY - towerHeight * 0.8);
            cable2Right.setAttribute("x2", startX + bridgeWidth - i * cableOffset);
            cable2Right.setAttribute("y2", startY);
            cable2Right.setAttribute("stroke", config.colors.bridge);
            cable2Right.setAttribute("stroke-width", "2");
            
            bridgeGroup.appendChild(cable1Left);
            bridgeGroup.appendChild(cable1Right);
            bridgeGroup.appendChild(cable2Left);
            bridgeGroup.appendChild(cable2Right);
        }
        
        // 添加到桥梁组
        bridgeGroup.appendChild(bridgeDeck);
        bridgeGroup.appendChild(tower1);
        bridgeGroup.appendChild(tower2);
        
        // 保存桥梁结构参数供传感器定位使用
        data.bridgeStructure = {
            startX,
            startY,
            bridgeWidth,
            bridgeHeight,
            tower1X,
            tower2X,
            towerHeight
        };
        
        console.log("桥梁结构绘制完成");
    }
    
    /**
     * 绘制传感器点
     */
    function drawSensors() {
        // 清空现有传感器
        sensorsGroup.innerHTML = "";
        
        if (!data.sensors || data.sensors.length === 0) {
            console.warn("没有传感器数据");
            return;
        }
        
        const { startX, startY, bridgeWidth, tower1X, tower2X, towerHeight } = data.bridgeStructure;
        
        // 绘制每个传感器点
        data.sensors.forEach((sensor, index) => {
            let x, y;
            
            // 根据传感器ID决定位置
            if (sensor.id.startsWith('C')) {
                // 缆索传感器
                const cableNum = parseInt(sensor.id.substr(3)) || index;
                const towerNum = cableNum <= 8 ? 1 : 2;
                const localNum = towerNum === 1 ? cableNum : cableNum - 8;
                
                if (towerNum === 1) {
                    x = startX + bridgeWidth * (0.1 + 0.15 * (localNum / 8));
                } else {
                    x = startX + bridgeWidth * (0.75 - 0.15 * (localNum / 8));
                }
                y = startY - (towerHeight * 0.2) * (localNum / 8);
            } else if (sensor.id.startsWith('T')) {
                // 塔柱温度传感器
                const towerNum = parseInt(sensor.id.substr(3)) || index;
                x = towerNum <= 2 ? tower1X : tower2X;
                y = startY - towerHeight * 0.4;
            } else if (sensor.id.startsWith('V')) {
                // 振动传感器
                const posNum = parseInt(sensor.id.substr(3)) || index;
                x = startX + (bridgeWidth * posNum) / 5;
                y = startY - 5;
            } else {
                // 其他传感器 - 均匀分布在桥面上
                x = startX + (bridgeWidth * (index + 1)) / (data.sensors.length + 1);
                y = startY - 5;
            }
            
            // 创建传感器点
            const sensorPoint = document.createElementNS(svgNS, "circle");
            sensorPoint.setAttribute("cx", x);
            sensorPoint.setAttribute("cy", y);
            sensorPoint.setAttribute("r", 6);
            sensorPoint.setAttribute("fill", getStatusColor(sensor.status));
            sensorPoint.setAttribute("stroke", "#ffffff");
            sensorPoint.setAttribute("stroke-width", "1.5");
            sensorPoint.setAttribute("data-sensor-id", sensor.id);
            sensorPoint.classList.add("sensor-point");
            
            // 添加点击事件
            sensorPoint.addEventListener("click", function(e) {
                e.stopPropagation();
                selectSensor(sensor);
            });
            
            // 添加鼠标悬停事件
            sensorPoint.addEventListener("mouseenter", function() {
                showTooltip(sensor, x, y);
                this.setAttribute("r", "8"); // 放大点
            });
            
            sensorPoint.addEventListener("mouseleave", function() {
                hideTooltip();
                if (data.selectedSensor?.id !== sensor.id) {
                    this.setAttribute("r", "6"); // 恢复大小
                }
            });
            
            // 添加到传感器组
            sensorsGroup.appendChild(sensorPoint);
        });
        
        console.log(`已绘制 ${data.sensors.length} 个传感器点`);
    }
    
    /**
     * 获取状态对应的颜色
     */
    function getStatusColor(status) {
        switch(status) {
            case 'normal': return config.colors.normal;
            case 'warning': return config.colors.warning;
            case 'danger': return config.colors.danger;
            case 'offline': return config.colors.offline;
            default: return config.colors.normal;
        }
    }
    
    /**
     * 显示传感器提示框
     */
    function showTooltip(sensor, x, y) {
        // 清除现有提示
        tooltipGroup.innerHTML = "";
        
        // 创建提示背景
        const tooltip = document.createElementNS(svgNS, "g");
        tooltip.setAttribute("class", "sensor-tooltip");
        
        const background = document.createElementNS(svgNS, "rect");
        background.setAttribute("x", x + 10);
        background.setAttribute("y", y - 45);
        background.setAttribute("width", 120);
        background.setAttribute("height", 65);
        background.setAttribute("rx", 4);
        background.setAttribute("ry", 4);
        background.setAttribute("fill", "white");
        background.setAttribute("stroke", "#cccccc");
        background.setAttribute("stroke-width", "1");
        
        // 创建提示文本
        const idText = document.createElementNS(svgNS, "text");
        idText.setAttribute("x", x + 15);
        idText.setAttribute("y", y - 25);
        idText.setAttribute("fill", "#333333");
        idText.setAttribute("font-size", "12");
        idText.textContent = `ID: ${sensor.id}`;
        
        const nameText = document.createElementNS(svgNS, "text");
        nameText.setAttribute("x", x + 15);
        nameText.setAttribute("y", y - 10);
        nameText.setAttribute("fill", "#333333");
        nameText.setAttribute("font-size", "12");
        nameText.textContent = sensor.name || '未命名传感器';
        
        const valueText = document.createElementNS(svgNS, "text");
        valueText.setAttribute("x", x + 15);
        valueText.setAttribute("y", y + 5);
        valueText.setAttribute("fill", getStatusColor(sensor.status));
        valueText.setAttribute("font-size", "12");
        valueText.setAttribute("font-weight", "bold");
        valueText.textContent = `值: ${sensor.value} (${sensor.status === 'normal' ? '正常' : sensor.status === 'warning' ? '警告' : '危险'})`;
        
        // 添加到提示组
        tooltip.appendChild(background);
        tooltip.appendChild(idText);
        tooltip.appendChild(nameText);
        tooltip.appendChild(valueText);
        
        tooltipGroup.appendChild(tooltip);
    }
    
    /**
     * 隐藏提示框
     */
    function hideTooltip() {
        tooltipGroup.innerHTML = "";
    }
    
    /**
     * 选中传感器
     */
    function selectSensor(sensor) {
        // 更新选中状态
        data.selectedSensor = sensor;
        
        // 重置所有传感器点样式
        const sensorPoints = sensorsGroup.querySelectorAll(".sensor-point");
        sensorPoints.forEach(point => {
            point.setAttribute("r", "6");
            point.setAttribute("stroke", "#ffffff");
            point.setAttribute("stroke-width", "1.5");
        });
        
        // 设置选中传感器点样式
        const selectedPoint = sensorsGroup.querySelector(`[data-sensor-id="${sensor.id}"]`);
        if (selectedPoint) {
            selectedPoint.setAttribute("r", "8");
            selectedPoint.setAttribute("stroke", "#007aff");
            selectedPoint.setAttribute("stroke-width", "2");
        }
        
        // 触发选中事件
        if (typeof config.onSensorSelect === 'function') {
            config.onSensorSelect(sensor);
        }
        
        // 触发自定义事件
        const event = new CustomEvent('sensorSelected', { detail: { sensor } });
        document.dispatchEvent(event);
        
        console.log("选中传感器:", sensor.id);
    }
    
    /**
     * 更新某个传感器的状态
     */
    function updateSensorPoint(sensor) {
        if (!sensor || !sensor.id) return;
        
        const sensorPoint = sensorsGroup.querySelector(`[data-sensor-id="${sensor.id}"]`);
        if (sensorPoint) {
            sensorPoint.setAttribute("fill", getStatusColor(sensor.status));
            
            // 如果当前选中的是这个传感器，更新tooltip
            if (data.selectedSensor && data.selectedSensor.id === sensor.id) {
                const x = parseFloat(sensorPoint.getAttribute("cx"));
                const y = parseFloat(sensorPoint.getAttribute("cy"));
                showTooltip(sensor, x, y);
            }
        }
    }
    
    /**
     * 鼠标按下事件处理
     */
    function onMouseDown(e) {
        if (e.button !== 0) return; // 只响应左键
        
        data.isDragging = true;
        data.dragStart.x = e.clientX;
        data.dragStart.y = e.clientY;
        
        svg.style.cursor = "grabbing";
    }
    
    /**
     * 鼠标抬起事件处理
     */
    function onMouseUp(e) {
        data.isDragging = false;
        svg.style.cursor = "grab";
    }
    
    /**
     * 鼠标移动事件处理
     */
    function onMouseMove(e) {
        if (!data.isDragging) return;
        
        const dx = e.clientX - data.dragStart.x;
        const dy = e.clientY - data.dragStart.y;
        
        data.offset.x += dx;
        data.offset.y += dy;
        
        data.dragStart.x = e.clientX;
        data.dragStart.y = e.clientY;
        
        updateTransform();
    }
    
    /**
     * 鼠标滚轮事件处理 - 缩放
     */
    function onWheel(e) {
        e.preventDefault();
        
        const delta = Math.sign(e.deltaY) * -0.1;
        const newZoom = Math.max(data.minZoom, Math.min(data.maxZoom, data.zoomLevel + delta));
        
        if (newZoom !== data.zoomLevel) {
            // 计算鼠标位置相对于SVG的坐标
            const rect = svg.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 调整偏移量，使缩放中心位于鼠标位置
            const scaleChange = newZoom / data.zoomLevel;
            data.offset.x = mouseX - (mouseX - data.offset.x) * scaleChange;
            data.offset.y = mouseY - (mouseY - data.offset.y) * scaleChange;
            
            data.zoomLevel = newZoom;
            updateTransform();
        }
    }
    
    /**
     * 更新变换矩阵
     */
    function updateTransform() {
        const transform = `translate(${data.offset.x}px, ${data.offset.y}px) scale(${data.zoomLevel})`;
        bridgeGroup.style.transform = transform;
        sensorsGroup.style.transform = transform;
    }
    
    /**
     * 重置视图
     */
    function resetView() {
        data.offset.x = 0;
        data.offset.y = 0;
        data.zoomLevel = 1;
        updateTransform();
    }
    
    /**
     * 加载传感器数据
     */
    function loadSensorData(sensors) {
        data.sensors = sensors || [];
        drawSensors();
    }
    
    /**
     * 添加单个传感器点
     */
    function addSensorPoint(sensor) {
        if (!sensor || !sensor.id) {
            console.error("无效的传感器数据");
            return;
        }
        
        // 添加到数据集合
        data.sensors.push(sensor);
        
        // 如果SVG已初始化，立即绘制
        if (bridgeGroup && sensorsGroup) {
            // 根据传感器数据计算位置
            const { startX, startY, bridgeWidth } = data.bridgeStructure || { 
                startX: 0, 
                startY: config.height * 0.6, 
                bridgeWidth: config.width * 0.8 
            };
            
            // 使用传入的相对位置或随机位置
            const x = startX + (sensor.x || Math.random()) * bridgeWidth;
            const y = startY - (sensor.y || Math.random()) * 50;
            
            // 创建传感器点
            const sensorPoint = document.createElementNS(svgNS, "circle");
            sensorPoint.setAttribute("cx", x);
            sensorPoint.setAttribute("cy", y);
            sensorPoint.setAttribute("r", 6);
            sensorPoint.setAttribute("fill", getStatusColor(sensor.status));
            sensorPoint.setAttribute("stroke", "#ffffff");
            sensorPoint.setAttribute("stroke-width", "1.5");
            sensorPoint.setAttribute("data-sensor-id", sensor.id);
            sensorPoint.classList.add("sensor-point");
            
            // 添加点击事件
            sensorPoint.addEventListener("click", function(e) {
                e.stopPropagation();
                selectSensor(sensor);
            });
            
            // 添加鼠标悬停事件
            sensorPoint.addEventListener("mouseenter", function() {
                showTooltip(sensor, x, y);
                this.setAttribute("r", "8"); // 放大点
            });
            
            sensorPoint.addEventListener("mouseleave", function() {
                hideTooltip();
                if (data.selectedSensor?.id !== sensor.id) {
                    this.setAttribute("r", "6"); // 恢复大小
                }
            });
            
            // 添加到传感器组
            sensorsGroup.appendChild(sensorPoint);
            
            console.log(`添加传感器点: ${sensor.id}`);
        } else {
            console.warn("SVG尚未初始化，传感器点将在下次redraw时添加");
        }
    }
    
    /**
     * 初始化模块
     */
    function init(options) {
        // 合并配置
        if (options) {
            if (options.container) config.container = options.container;
            if (options.colors) Object.assign(config.colors, options.colors);
            if (options.onSensorSelect) config.onSensorSelect = options.onSensorSelect;
            if (options.width) config.width = options.width;
            if (options.height) config.height = options.height;
        }
        
        if (!config.container) {
            console.error("未指定容器元素");
            return false;
        }
        
        // 如果container是字符串ID，则获取DOM元素
        if (typeof config.container === 'string') {
            config.container = document.getElementById(config.container);
            if (!config.container) {
                console.error("找不到指定ID的容器元素:", options.container);
                return false;
            }
        }
        
        try {
            // 初始化SVG
            initSVG();
            
            // 绘制桥梁结构
            drawBridge();
            
            // 加载传感器数据
            if (options.sensors) {
                loadSensorData(options.sensors);
            }
            
            console.log("桥梁向量图形模块初始化完成");
            return true;
        } catch (error) {
            console.error("初始化桥梁向量图形模块时出错:", error);
            return false;
        }
    }
    
    // 公开的API
    return {
        init, 
        loadSensorData,
        updateSensorPoint,
        selectSensor,
        resetView,
        addSensorPoint
    };
})();

// 如果在浏览器环境中，将模块挂载到window对象
if (typeof window !== 'undefined') {
    window.BridgeVector = BridgeVector;
} 