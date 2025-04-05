// savePrompt.js

// 添加保存状态标志
let isFileSaved = false;

// 监听文件输入变化
document.getElementById('fileInput').addEventListener('change', function (e) {
    // 当用户选择文件后视为已保存状态
    // isFileSaved = true;
    // 这里可以添加文件处理逻辑
});

// 添加页面关闭前的确认提示
window.addEventListener('beforeunload', function (e) {
    if (!isFileSaved) {
        // 创建确认对话框
        const confirmationMessage = '您是否已保存文件？';

        (e || window.event).returnValue = confirmationMessage; // 兼容IE
        return confirmationMessage; // 兼容其他浏览器
    }
});

// 添加行点击选中功能
window.addEventListener('click', function(e) {
    const clickedRow = e.target.closest('tr');
    if (clickedRow) {
        // 移除之前选中的行
        const previouslySelected = requirementsTableBody.querySelector('tr.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        // 选中当前点击的行
        clickedRow.classList.add('selected');
    }
});

const requirementsTableBody = document.querySelector('#requirementsTable tbody');

// 添加新建需求按钮点击事件
document.getElementById('Button_AddNewRequirement').addEventListener('click', function () {
    // 生成一个新的需求ID（可以简单递增，或根据需要生成唯一ID）
    const existingRows = requirementsTableBody.querySelectorAll('tr');
    const newId = existingRows.length + 1; // 简单递增ID

    // 创建新行并填充默认数据
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td contenteditable="true">${newId}</td>
        <td contenteditable="true">新需求内容</td>
        <td contenteditable="true">基础需求内容</td>
        <td contenteditable="true">引用需求内容</td>
        <td contenteditable="true">备注内容</td>
    `;

    // 将新行添加到表格主体中
    requirementsTableBody.appendChild(newRow);

    // 标记为未保存
    isFileSaved = false;
});

// 添加保存所有需求按钮点击事件
document.getElementById('Button_SaveAllRequirements').addEventListener('click', function () {
    // 获取表格中的所有行数据
    const rows = requirementsTableBody.querySelectorAll('tr');
    const requirements = [];

    rows.forEach((row, index) => {
        // 跳过表头（假设第一行是表头，但这里没有表头行在 tbody 中，所以直接处理所有行）
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) { // 确保行中有单元格
            const requirement = {
                id: cells[0].innerText.trim(), // 保持为字符串
                content: cells[1].innerText.trim(),
                baseRequirements: cells[2].innerText.trim().split(/;|\n/).map(item => item.trim()).filter(item => item), // 拆分为数组并去除空项
                referencedRequirements: cells[3].innerText.trim().split(/;|\n/).map(item => item.trim()).filter(item => item), // 拆分为数组并去除空项
                comments: cells[4].innerText.trim().split(/;|\n/).map(item => item.trim()).filter(item => item), // 拆分为数组并去除空项
            };
            requirements.push(requirement);
        }
    });

    // 将需求数据转换为 JSON 字符串
    const jsonData = JSON.stringify(requirements, null, 2);

    // 下载 JSON 文件（保存到本地）
    const blob = new Blob([jsonData], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'requirements.json';
    a.click();

    // 标记为已保存
    isFileSaved = true;

    // 可选：提示用户保存成功
    alert('需求已成功保存为 requirements.json 文件！');
});

// 添加删除需求按钮点击事件
document.getElementById('Button_DeleteRequirements').addEventListener('click', function () {
    // 获取当前选中的行（可以通过高亮或其他方式标记选中行）
    const selectedRow = requirementsTableBody.querySelector('tr.selected');
    
    if (!selectedRow) {
        alert('请先选中要删除的需求行！');
        return;
    }

    // 确认删除
    if (!confirm('确定要删除选中的需求吗？')) {
        return;
    }

    // 删除选中行
    requirementsTableBody.removeChild(selectedRow);
    
    // 重新编号所有行（可选）
    const rows = requirementsTableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const idCell = row.querySelector('td:first-child');
        if (idCell) {
            idCell.textContent = index + 1;
        }
    });

    // 标记为未保存
    isFileSaved = false;
});

// 添加修改需求按钮点击事件
document.getElementById('Button_EditRequirement').addEventListener('click', function () {
    // 获取当前选中的行（可以通过高亮或其他方式标记选中行）
    const selectedRow = requirementsTableBody.querySelector('tr.selected');
    
    if (!selectedRow) {
        alert('请先选中要修改的需求行！');
        return;
    }

    // 确保行中有单元格
    const cells = selectedRow.querySelectorAll('td');
    if (cells.length === 0) {
        return;
    }

    // 将单元格内容变为可编辑状态
    cells.forEach(cell => {
        cell.contentEditable = true;
        cell.focus(); // 选中第一个单元格以便直接编辑
    });

    // 提示用户开始编辑
    alert('您现在可以编辑选中的需求行。编辑完成后，请记得点击保存所有需求按钮。');

    // 标记为未保存（因为用户正在编辑）
    isFileSaved = false;
});
