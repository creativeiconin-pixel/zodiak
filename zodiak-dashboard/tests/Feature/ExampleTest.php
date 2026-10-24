<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_root_redirects_to_the_op_center(): void
    {
        $this->get('/')->assertRedirect('/admin');
    }

    public function test_op_center_root_redirects_to_the_overview(): void
    {
        $this->get('/admin')->assertRedirect('/admin/overview');
    }
}
