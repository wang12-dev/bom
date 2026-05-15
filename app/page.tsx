"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [styleName, setStyleName] = useState("");
  const [list, setList] = useState<any[]>([]); // 存储款式列表
  const [loading, setLoading] = useState(false);

  // 1. 获取列表函数
  const fetchStyles = async () => {
    const res = await fetch("/api/list");
    const data = await res.json();
    if (Array.isArray(data)) setList(data);
  };

  // 2. 页面初次加载时读取数据
  useEffect(() => {
    fetchStyles();
  }, []);

  // 3. 提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ styleName }),
      });

      const result = await response.json();
      if (result.success) {
        setStyleName(""); // 清空输入框
        await fetchStyles(); // 立即刷新列表，实现“实时”感
      } else {
        alert("保存失败: " + result.error);
      }
    } catch (error) {
      alert("请求出错");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">款式管理 MVP</h1>

      {/* 输入表单 */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-10">
        <input
          type="text"
          value={styleName}
          onChange={(e) => setStyleName(e.target.value)}
          placeholder="输入新款式名称"
          className="flex-1 border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "保存中..." : "添加款式"}
        </button>
      </form>

      {/* 数据展示列表 */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold border-b pb-2">已存入的款式</h2>
        {list.length === 0 && (
          <p className="text-gray-400">暂无款式，快去添加吧！</p>
        )}
        {list.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded border"
          >
            <span className="font-medium text-gray-800">{item.name}</span>
            <span className="text-xs text-gray-400">
              {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
