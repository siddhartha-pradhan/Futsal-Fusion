﻿using Application.Common.Mappings;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Images.Dtos
{
    public class ImageVm : IMapFrom<Image>
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public int SportObjectId { get; set; }
    }
}
