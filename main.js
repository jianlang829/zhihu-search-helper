// ==UserScript==
// @name         搜索知乎
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  点击扩展打开搜索框，输入后跳转到指定网站搜索
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ========== 修改此处的网址模板 ==========
    const SEARCH_URL_TEMPLATE = "https://www.zhihu.com/search?q={keyword}";
    // =======================================

    // 创建Shadow DOM容器
    const container = document.createElement('div');
    const shadow = container.attachShadow({mode: 'open'});
    document.body.appendChild(container);

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .search-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: none;
            flex-direction: column;
            gap: 10px;
            width: 250px;
            box-sizing: border-box;
        }
        .search-input {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
        }
        .search-button {
            padding: 8px 12px;
            background: #0078d7;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }
        .search-button:hover {
            background: #0066b8;
        }
        .trigger-button {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9998;
            padding: 10px 16px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        }
        .trigger-button:hover {
            background: #218838;
        }
        .close-button {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #999;
        }
        .close-button:hover {
            color: #333;
        }
        .error-message {
            color: #dc3545;
            font-size: 12px;
            display: none;
        }
        /* 响应式设计 */
        @media (max-width: 768px) {
            .search-container {
                top: 10px;
                right: 10px;
                left: 10px;
                width: auto;
            }
            .trigger-button {
                top: 10px;
                right: 10px;
                padding: 8px 14px;
            }
        }
    `;
    shadow.appendChild(style);

    // 创建搜索框和按钮
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-button';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        hideSearchContainer();
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = "输入搜索词";
    input.className = 'search-input';

    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = '请输入搜索关键词';

    const button = document.createElement('button');
    button.textContent = "搜索";
    button.className = 'search-button';

    button.addEventListener('click', () => {
        const keyword = input.value.trim();
        if (!keyword) {
            errorMsg.style.display = 'block';
            return;
        }
        const encodedKeyword = encodeURIComponent(keyword);
        window.open(SEARCH_URL_TEMPLATE.replace("{keyword}", encodedKeyword), '_blank');
        hideSearchContainer();
    });

    searchContainer.appendChild(closeBtn);
    searchContainer.appendChild(input);
    searchContainer.appendChild(button);
    searchContainer.appendChild(errorMsg);
    shadow.appendChild(searchContainer);

    // 创建触发按钮
    const triggerBtn = document.createElement('button');
    triggerBtn.className = 'trigger-button';
    triggerBtn.textContent = "搜索";

    triggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSearchContainer();
    });

    shadow.appendChild(triggerBtn);

    // 全局点击事件监听
    document.addEventListener('click', (e) => {
        if (!shadow.contains(e.target)) {
            hideSearchContainer();
        }
    });

    // 显示/隐藏搜索容器函数
    function toggleSearchContainer() {
        const isVisible = searchContainer.style.display === 'flex';
        searchContainer.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            input.focus();
            errorMsg.style.display = 'none';
        }
    }

    function hideSearchContainer() {
        searchContainer.style.display = 'none';
        errorMsg.style.display = 'none';
    }
})();
