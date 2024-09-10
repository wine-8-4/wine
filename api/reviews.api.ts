import { axiosInstance } from './_axiosInstance';

type UpdateReviewRequest = {
  rating: number;
  lightBold: number;
  smoothTannic: number;
  drySweet: number;
  softAcidic: number;
  aroma: string[];
  content: string;
};

export const updateWineDetail = async (
  id: number,
  updateData: UpdateReviewRequest
) => {
  try {
    const response = await axiosInstance({
      method: 'PATCH',
      url: `/reviews/${id}`,
      data: updateData,
    });
    return response.data;
  } catch (error) {
    console.error('와인 정보를 수정하는 데 실패했습니다:', error);
    throw error; // 에러를 호출자에게 전달합니다.
  }
};

export const postWineReview = async (reviewData: {
  rating: number;
  lightBold: number;
  smoothTannic: number;
  drySweet: number;
  softAcidic: number;
  aroma: string[];
  content: string;
  wineId: number;
}) => {
  const accessToken = `Bearer ${localStorage.getItem('accessToken')}`;
  const response = await axiosInstance({
    method: 'POST',
    url: '/reviews',
    data: reviewData,
    headers: {
      Authorization: accessToken,
    },
  });

  return response;
};
