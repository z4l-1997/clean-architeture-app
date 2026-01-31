"use client";

import React from "react";
import { useMenu } from "./hook/useMenu";
import { MonAnEntity } from "@/domain/entities/mon-an.entity";
import { useAuthContext } from "@/presentation/providers/auth.provider";

function MonAnCard({ monAn }: { monAn: MonAnEntity }) {
  const hasDiscount = monAn.giam_gia > 0;

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-lg font-semibold">{monAn.ten}</h3>
        {!monAn.con_hang && (
          <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-600">Hết hàng</span>
        )}
        {monAn.con_hang && monAn.co_the_ban && (
          <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600">Còn hàng</span>
        )}
      </div>
      <p className="mb-3 text-sm text-gray-600">{monAn.mo_ta}</p>
      <div className="flex items-center gap-2">
        {hasDiscount && (
          <span className="text-sm text-gray-400 line-through">
            {monAn.gia.toLocaleString("vi-VN")}đ
          </span>
        )}
        <span className="text-lg font-bold text-green-700">
          {monAn.gia_sau_giam.toLocaleString("vi-VN")}đ
        </span>
        {hasDiscount && (
          <span className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-600">
            -{monAn.giam_gia}%
          </span>
        )}
      </div>
    </div>
  );
}

export default function MenuView() {
  const { data, loading, error, refetch } = useMenu();
  const { userInfo } = useAuthContext();

  console.log("userInfo", userInfo);

  if (loading) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <p className="text-gray-500">Đang tải danh sách món ăn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-50flex-col items-center justify-center gap-2">
        <p className="text-red-500">{error}</p>
        <button
          onClick={refetch}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex min-h-50items-center justify-center">
        <p className="text-gray-500">Chưa có món ăn nào trong menu.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Danh sách món ăn</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((monAn) => (
          <MonAnCard key={monAn.id} monAn={monAn} />
        ))}
      </div>
    </div>
  );
}
