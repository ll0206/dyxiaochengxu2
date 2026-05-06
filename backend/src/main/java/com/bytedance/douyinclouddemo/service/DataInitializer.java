package com.bytedance.douyinclouddemo.service;

import com.bytedance.douyinclouddemo.entity.Banner;
import com.bytedance.douyinclouddemo.entity.ConstructionStatus;
import com.bytedance.douyinclouddemo.entity.Coupon;
import com.bytedance.douyinclouddemo.entity.Review;
import com.bytedance.douyinclouddemo.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Slf4j
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private BannerRepository bannerRepository;
    @Autowired
    private CouponRepository couponRepository;
    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public void run(String... args) {
        initBanners();
        initCoupons();
        initReviews();
    }

    private void initBanners() {
        if (bannerRepository.count() == 0) {
            Banner b1 = new Banner();
            b1.setImageUrl("/images/banners/banner1.jpg");
            b1.setTitle("奔驰S级迈巴赫升级方案");
            b1.setSortOrder(1);
            bannerRepository.save(b1);

            Banner b2 = new Banner();
            b2.setImageUrl("/images/banners/banner2.jpg");
            b2.setTitle("宝马5系F18无损升级");
            b2.setSortOrder(2);
            bannerRepository.save(b2);

            Banner b3 = new Banner();
            b3.setImageUrl("/images/banners/banner3.jpg");
            b3.setTitle("保时捷帕拉梅拉Turbo S包围");
            b3.setSortOrder(3);
            bannerRepository.save(b3);

            log.info("Initialized 3 banners");
        }
    }

    private void initCoupons() {
        if (couponRepository.count() == 0) {
            Coupon c1 = new Coupon();
            c1.setName("老改新满减券");
            c1.setDescription("满10000减500");
            c1.setDiscountAmount(500);
            c1.setMinSpend(10000);
            c1.setDiscountType("amount");
            couponRepository.save(c1);

            Coupon c2 = new Coupon();
            c2.setName("内饰翻新折扣券");
            c2.setDescription("全场8.8折");
            c2.setDiscountAmount(12);
            c2.setMinSpend(0);
            c2.setDiscountType("percent");
            couponRepository.save(c2);

            Coupon c3 = new Coupon();
            c3.setName("首次预约券");
            c3.setDescription("免费车辆检查");
            c3.setDiscountAmount(0);
            c3.setMinSpend(0);
            c3.setDiscountType("free");
            couponRepository.save(c3);

            log.info("Initialized 3 coupons");
        }
    }

    private void initReviews() {
        if (reviewRepository.count() == 0) {
            Review[] reviews = {
                createReview("张**", "宝马5系 F18", "外观升级", 5, "老款5系升级22款运动版，效果非常满意！师傅手艺很好，价格也很公道。"),
                createReview("李**", "奔驰S级 W221", "迈巴赫升级", 5, "S级升级迈巴赫，太帅了！朋友都以为我买了新车。"),
                createReview("王**", "宝马X5 E70", "外观升级", 5, "X5升级24款运动版，外观变化很大，家人都很喜欢。"),
                createReview("陈**", "保时捷帕拉梅拉", "Turbo S包围", 5, "帕拉梅拉改Turbo S包围，质感很好，做工精细。")
            };
            reviewRepository.saveAll(Arrays.asList(reviews));
            log.info("Initialized 4 reviews");
        }
    }

    private Review createReview(String nickname, String carModel, String serviceItem, int stars, String content) {
        Review r = new Review();
        r.setNickname(nickname);
        r.setAvatarUrl("");
        r.setCarModel(carModel);
        r.setServiceItem(serviceItem);
        r.setStars(stars);
        r.setContent(content);
        r.setStatus("approved");
        return r;
    }
}
