/**
 * 简化版桥梁向量图形模块
 * 只包含基本的绘制功能
 */
 
// 全局命名空间
const BridgeVector = (function() {
    // 配置
    let config = {
        container: null,
        width: 0,
        height: 0
    };
    
    // 数据
    let data = {
        sensors: []
    };
    
    // SVG元素
    let svg = null;
    
    // 初始化函数
    function init(options) {
        console.log('简化版BridgeVector.init被调用');
        
        // 参数检查
        if (!options || !options.container) {
            console.error('缺少必要的初始化参数');
            return false;
        }
        
        // 保存配置
        config.container = options.container;
        if (options.sensors) {
            data.sensors = options.sensors;
        }
        
        try {
            // 获取容器元素
            let containerElement;
            if (typeof config.container === 'string') {
                containerElement = document.getElementById(config.container);
                if (!containerElement) {
                    console.error(`找不到ID为 ${config.container} 的容器元素`);
                    return false;
                }
            } else if (config.container instanceof HTMLElement) {
                containerElement = config.container;
            } else {
                console.error('容器参数类型无效');
                return false;
            }
            
            // 获取容器尺寸
            config.width = options.width || containerElement.clientWidth || 800;
            config.height = options.height || containerElement.clientHeight || 400;
            console.log('容器尺寸:', config.width, 'x', config.height);
            
            // 创建SVG
            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.setAttribute("viewBox", `0 0 ${config.width} ${config.height}`);
            svg.style.backgroundColor = "#f8f9fa";
            
            // 添加到容器
            containerElement.innerHTML = '';
            containerElement.appendChild(svg);
            
            // 绘制桥梁
            drawSimpleBridge();
            
            // 绘制传感器
            if (data.sensors && data.sensors.length > 0) {
                drawSensors();
            }
            
            console.log('简化版BridgeVector初始化成功');
            return true;
        } catch (error) {
            console.error('初始化时出错:', error);
            return false;
        }
    }
    
    // 绘制简单桥梁
    function drawSimpleBridge() {
        const width = config.width;
        const height = config.height;
        
        // 创建桥面
        const bridge = document.createElementNS("http://www.w3.org/2000/svg", "line");
        bridge.setAttribute("x1", width * 0.1);
        bridge.setAttribute("y1", height * 0.6);
        bridge.setAttribute("x2", width * 0.9);
        bridge.setAttribute("y2", height * 0.6);
        bridge.setAttribute("stroke", "#555555");
        bridge.setAttribute("stroke-width", "8");
        svg.appendChild(bridge);
        
        // 创建左塔
        const leftTower = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        leftTower.setAttribute("x", width * 0.25 - 5);
        leftTower.setAttribute("y", height * 0.2);
        leftTower.setAttribute("width", "10");
        leftTower.setAttribute("height", height * 0.4);
        leftTower.setAttribute("fill", "#555555");
        svg.appendChild(leftTower);
        
        // 创建右塔
        const rightTower = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rightTower.setAttribute("x", width * 0.75 - 5);
        rightTower.setAttribute("y", height * 0.2);
        rightTower.setAttribute("width", "10");
        rightTower.setAttribute("height", height * 0.4);
        rightTower.setAttribute("fill", "#555555");
        svg.appendChild(rightTower);
        
        // 添加一些拉索
        for (let i = 0; i < 5; i++) {
            // 左塔左侧拉索
            const leftCable1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            leftCable1.setAttribute("x1", width * 0.25);
            leftCable1.setAttribute("y1", height * 0.25);
            leftCable1.setAttribute("x2", width * (0.1 + i * 0.03));
            leftCable1.setAttribute("y2", height * 0.6);
            leftCable1.setAttribute("stroke", "#777777");
            leftCable1.setAttribute("stroke-width", "2");
            svg.appendChild(leftCable1);
            
            // 左塔右侧拉索
            const leftCable2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            leftCable2.setAttribute("x1", width * 0.25);
            leftCable2.setAttribute("y1", height * 0.25);
            leftCable2.setAttribute("x2", width * (0.25 + i * 0.03));
            leftCable2.setAttribute("y2", height * 0.6);
            leftCable2.setAttribute("stroke", "#777777");
            leftCable2.setAttribute("stroke-width", "2");
            svg.appendChild(leftCable2);
            
            // 右塔左侧拉索
            const rightCable1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            rightCable1.setAttribute("x1", width * 0.75);
            rightCable1.setAttribute("y1", height * 0.25);
            rightCable1.setAttribute("x2", width * (0.75 - i * 0.03));
            rightCable1.setAttribute("y2", height * 0.6);
            rightCable1.setAttribute("stroke", "#777777");
            rightCable1.setAttribute("stroke-width", "2");
            svg.appendChild(rightCable1);
            
            // 右塔右侧拉索
            const rightCable2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            rightCable2.setAttribute("x1", width * 0.75);
            rightCable2.setAttribute("y1", height * 0.25);
            rightCable2.setAttribute("x2", width * (0.9 - i * 0.03));
            rightCable2.setAttribute("y2", height * 0.6);
            rightCable2.setAttribute("stroke", "#777777");
            rightCable2.setAttribute("stroke-width", "2");
            svg.appendChild(rightCable2);
        }
        
        console.log('桥梁绘制完成');
    }
    
    // 绘制传感器
    function drawSensors() {
        const width = config.width;
        const height = config.height;
        
        data.sensors.forEach((sensor, index) => {
            // 根据传感器类型确定位置
            let x, y;
            
            if (sensor.id.startsWith('C')) {
                // 缆索传感器
                const num = parseInt(sensor.id.substr(3)) || 1;
                x = width * (0.2 + (num / 10) * 0.6);
                y = height * (0.6 - Math.random() * 0.2);
            } else if (sensor.id.startsWith('T')) {
                // 温度传感器
                const num = parseInt(sensor.id.substr(3)) || 1;
                x = width * (0.25 + (num % 2) * 0.5);
                y = height * 0.3;
            } else if (sensor.id.startsWith('V')) {
                // 振动传感器
                const num = parseInt(sensor.id.substr(3)) || 1;
                x = width * (0.3 + (num / 10) * 0.4);
                y = height * 0.6 - 5;
            } else {
                // 其他传感器
                x = width * (0.1 + (index / data.sensors.length) * 0.8);
                y = height * 0.6 - 5;
            }
            
            // 创建传感器点
            const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            point.setAttribute("cx", x);
            point.setAttribute("cy", y);
            point.setAttribute("r", "6");
            point.setAttribute("data-id", sensor.id);
            
            // 根据状态设置颜色
            let color;
            switch (sensor.status) {
                case 'normal':
                    color = "#4cd964"; // 绿色
                    break;
                case 'warning':
                    color = "#ffcc00"; // 黄色
                    break;
                case 'danger':
                    color = "#ff3b30"; // 红色
                    break;
                default:
                    color = "#8e8e93"; // 灰色
            }
            
            point.setAttribute("fill", color);
            point.setAttribute("stroke", "#ffffff");
            point.setAttribute("stroke-width", "1.5");
            
            // 添加标签
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", x + 8);
            label.setAttribute("y", y - 8);
            label.setAttribute("font-size", "10");
            label.setAttribute("fill", "#333333");
            label.textContent = sensor.id;
            
            // 添加点击事件
            point.addEventListener("click", function() {
                alert(`传感器: ${sensor.id}\n名称: ${sensor.name}\n类型: ${sensor.type}\n值: ${sensor.value}\n状态: ${sensor.status}`);
            });
            
            // 添加到SVG
            svg.appendChild(point);
            svg.appendChild(label);
        });
        
        console.log(`已绘制 ${data.sensors.length} 个传感器点`);
    }
    
    // 更新传感器点
    function updateSensorPoint(sensor) {
        if (!svg || !sensor || !sensor.id) return;
        
        const point = svg.querySelector(`circle[data-id="${sensor.id}"]`);
        if (point) {
            // 根据状态更新颜色
            let color;
            switch (sensor.status) {
                case 'normal':
                    color = "#4cd964"; // 绿色
                    break;
                case 'warning':
                    color = "#ffcc00"; // 黄色
                    break;
                case 'danger':
                    color = "#ff3b30"; // 红色
                    break;
                default:
                    color = "#8e8e93"; // 灰色
            }
            
            point.setAttribute("fill", color);
        }
    }
    
    // 添加传感器点
    function addSensorPoint(sensor) {
        if (!svg || !sensor || !sensor.id) {
            console.error('添加传感器点失败：参数无效');
            return false;
        }
        
        try {
            // 将传感器添加到数据中
            data.sensors.push(sensor);
            
            // 计算位置
            const x = sensor.x * config.width;
            const y = sensor.y * config.height;
            
            // 创建传感器点
            const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            point.setAttribute("cx", x);
            point.setAttribute("cy", y);
            point.setAttribute("r", "6");
            point.setAttribute("data-id", sensor.id);
            
            // 根据状态设置颜色
            let color;
            switch (sensor.status) {
                case 'normal':
                    color = "#4cd964"; // 绿色
                    break;
                case 'warning':
                    color = "#ffcc00"; // 黄色
                    break;
                case 'alert':
                case 'danger':
                    color = "#ff3b30"; // 红色
                    break;
                default:
                    color = "#8e8e93"; // 灰色
            }
            
            point.setAttribute("fill", color);
            point.setAttribute("stroke", "#ffffff");
            point.setAttribute("stroke-width", "1.5");
            
            // 添加标签
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", x + 8);
            label.setAttribute("y", y - 8);
            label.setAttribute("font-size", "10");
            label.setAttribute("fill", "#333333");
            label.textContent = sensor.name || sensor.id;
            
            // 添加点击事件
            point.addEventListener("click", function() {
                alert(`传感器: ${sensor.name || sensor.id}\n类型: ${sensor.type || '未知'}\n状态: ${sensor.status || '未知'}\n位置: ${sensor.data?.location || '未知'}`);
            });
            
            // 添加到SVG
            svg.appendChild(point);
            svg.appendChild(label);
            
            return true;
        } catch (error) {
            console.error('添加传感器点时出错:', error);
            return false;
        }
    }
    
    // 暴露公共API
    return {
        init: init,
        addSensorPoint: addSensorPoint,
        updateSensorPoint: updateSensorPoint
    };
})();

// 自动将模块添加到window对象
if (typeof window !== 'undefined') {
    window.BridgeVector = BridgeVector;
    console.log("BridgeVector简化版模块已加载");
} 