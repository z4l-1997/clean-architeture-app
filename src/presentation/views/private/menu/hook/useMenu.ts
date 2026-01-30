"use client";

import { useCallback, useEffect, useState } from "react";
import { MonAnEntity } from "@/domain/entities/mon-an.entity";
import { useMonAnContext } from "@/presentation/views/private/menu/provider/mon-an.provider";

export function useMenu() {
  const { getAllMonAn } = useMonAnContext();
  const [data, setData] = useState<MonAnEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllMonAn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }, [getAllMonAn]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return { data, loading, error, refetch: fetchMenu };
}
