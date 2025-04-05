document.getElementById('fileInput').addEventListener('change', function (event) {
    // 获取用户选择的文件
    const file = event.target.files[0];
    if (file) {
        // 创建一个新的 FileReader 对象来读取文件
        const reader = new FileReader();
        // 设置文件读取成功后的回调函数
        reader.onload = function (e) {
            try {
                // 将读取到的 JSON 内容解析为对象
                const data = JSON.parse(e.target.result);
                // 调用函数渲染表格
                loadRequirementsTable(data);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file!');
            }
        };
        // 以文本形式读取文件
        reader.readAsText(file);
    }
});

/**
 * Function to load and display data in the table
 * @param {Array} data - The array of requirement objects
 */
function loadRequirementsTable(data) {
    const tableBody = document.querySelector('#requirementsTable tbody');
    tableBody.innerHTML = ''; // 清空现有表格行

    data.forEach(item => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = typeof item.id === 'string' ? item.id : 'N/A'; // 确保 id 是字符串
        
        const contentCell = document.createElement('td');
        contentCell.textContent = typeof item.content === 'string' ? item.content.trim() : 'N/A'; // 确保 content 是字符串
        
        const baseReqCell = document.createElement('td');
        if (Array.isArray(item.baseRequirements)) {
            baseReqCell.innerHTML = item.baseRequirements.map(req => String(req).trim()).join('<br>');
        } else if (typeof item.baseRequirements === 'string') {
            baseReqCell.textContent = item.baseRequirements.trim() || 'N/A';
        } else {
            baseReqCell.textContent = 'N/A'; // 默认值
        }
        
        const refReqCell = document.createElement('td');
        if (Array.isArray(item.referencedRequirements)) {
            refReqCell.innerHTML = item.referencedRequirements.map(req => String(req).trim()).join('<br>');
        } else if (typeof item.referencedRequirements === 'string') {
            refReqCell.textContent = item.referencedRequirements.trim() || 'N/A';
        } else {
            refReqCell.textContent = 'N/A'; // 默认值
        }
        
        const commentsCell = document.createElement('td');
        if (Array.isArray(item.comments)) {
            commentsCell.innerHTML = item.comments.map(req => String(req).trim()).join('<br>');
        } else if (typeof item.comments === 'string') {
            commentsCell.textContent = item.comments.trim() || 'N/A';
        } else {
            commentsCell.textContent = 'N/A'; // 默认值
        }

        // 将单元格添加到行中
        row.appendChild(idCell);
        row.appendChild(contentCell);
        row.appendChild(baseReqCell);
        row.appendChild(refReqCell);
        row.appendChild(commentsCell);

        // 将行添加到表格主体中
        tableBody.appendChild(row);
    });
}