import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { styleName } = await req.json();

    // 将数据插入到 styles 表中
    // 假设你的表里有一列叫 name
    const { data, error } = await supabase
      .from("styles")
      .insert([{ name: styleName }])
      .select();

    if (error) {
      console.error("数据库写入错误:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "数据已成功存入数据库",
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "请求处理失败" },
      { status: 500 },
    );
  }
}
