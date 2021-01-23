<?php
/**
 * Created by PhpStorm.
 * User: thaotm
 * Date: 26/11/2020
 * Time: 00:11
 */
namespace App\Services\Impl;

use App\Repositories\EnglishRepository;
use App\Services\EnglishService;

class EnglishServiceImpl implements EnglishService
{
    protected $englishRepository;


    public function __construct(EnglishRepository $englishRepository)
    {
        $this->englishRepository = $englishRepository;
    }

    public function getAll()
    {
        $englishs = $this->englishRepository->getAll();

        return $englishs;
    }

    public function findById($id)
    {
        $english = $this->englishRepository->findById($id);

        $statusCode = 200;
        if (!$english)
            $statusCode = 404;

        $data = [
            'statusCode' => $statusCode,
            'englishs' => $english
        ];

        return $data;
    }

    public function create($request)
    {
        $english = $this->englishRepository->create($request);

        $statusCode = 201;
        if (!$english)
            $statusCode = 500;

        $data = [
            'statusCode' => $statusCode,
            'englishs' => $english
        ];

        return $data;
    }

    public function update($request, $id)
    {
        $oldEnglish = $this->englishRepository->findById($id);

        if (!$oldEnglish) {
            $newEnglish = null;
            $statusCode = 404;
        } else {
            $newEnglish = $this->englishRepository->update($request, $oldEnglish);
            $statusCode = 200;
        }

        $data = [
            'statusCode' => $statusCode,
            'englishs' => $newEnglish
        ];
        return $data;
    }

    public function destroy($id)
    {
        $english = $this->englishRepository->findById($id);

        $statusCode = 404;
        $message = "User not found";
        if ($english) {
            $this->englishRepository->destroy($english);
            $statusCode = 200;
            $message = "Delete success!";
        }

        $data = [
            'statusCode' => $statusCode,
            'message' => $message
        ];
        return $data;
    }
}