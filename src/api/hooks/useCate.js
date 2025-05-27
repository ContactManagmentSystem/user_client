// src/api/hooks/useProdPkg.js

import { useQuery } from "@tanstack/react-query";
import { getData } from "../services/service";

export const useGetCate = (page = 1, limit = 5) => {
  return useQuery({
    queryKey: ["cate", page, limit],
    queryFn: () => getData("cate", page, limit),
  });
};
